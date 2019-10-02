const { createSocket } = require('dgram')

const TELLO_VIDEO_PORT = 11111
const TELLO_COMMAND_PORT = 8889
const TELLO_HOST = '192.168.10.1'
const TIMEOUT = 3 * 1000 // 3 seconds

class TelloSDK {
  constructor () {
    this.host = TELLO_HOST
    this.commandPort = TELLO_COMMAND_PORT
    this.videoPort = TELLO_VIDEO_PORT

    this.udpClient = createSocket('udp4')
    this.udpClient.bind(TELLO_COMMAND_PORT)
    this.activeMessages = 0

    // Close UDP socket and make sure we're not streaming or flying.
    const exitHandler = async options => {
      if (options.cleanup) {
        await this.sendCommand('command')
        await this.sendCommand('emergency')
        await this.sendCommand('streamoff')
        this.udpClient.close()
      }
      if (options.exit) {
        process.exit()
      }
    }

    process.on('exit', exitHandler.bind(null, { cleanup: true }))
    process.on('SIGINT', exitHandler.bind(null, { exit: true }))
    process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
    process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))
    process.on('uncaughtException', exitHandler.bind(null, { exit: true }))

    // Keep the connection alive.
    setInterval(async () => {
      await this.sendCommand('command')
    }, 10 * 1000)
  }

  // Tello only accepts one command at a time. We ~should~ block until we get a
  // response, but this could be dangerous. Instead, let's send all messages
  // all messages normally get a response of "OK" aside from battery. So I
  // think it's fine if the messages get a little jumbled.
  async sendCommand (command) {
    return new Promise(resolve => {
      console.log(`Sending command: ${command}`)
      if (this.activeMessages > 0) {
        console.warn(
          `WARNING: ${this.activeMessages} messages have been sent with no response!`
        )
      }

      this.activeMessages = this.activeMessages + 1

      // Remove listeners so we don't end up with a million.
      const timeoutID = setTimeout(() => {
        resolve()
        this.udpClient.removeListener('message', messageHandler)
      }, TIMEOUT)

      const messageHandler = msg => {
        this.activeMessages = 0
        resolve(msg)
        clearTimeout(timeoutID)
        this.udpClient.removeListener('message', messageHandler)
      }

      this.udpClient.on('message', messageHandler)
      this.udpClient.send(command, TELLO_COMMAND_PORT, TELLO_HOST)
    })
  }
}

module.exports = TelloSDK
