/* globals fetch, requestAnimationFrame, JSMpeg, droneaidCounter, objectDetector */

let streamCanvas
let predictionCanvas
let predictionCanvasCtx

let jsmpegPlayer
let predictionEnabled = false
let confidenceThreshold = 0.6
let historyThreshold = 15

let counter
let model

let manualKillStream = false

const predictionToggled = function() {
  cleanup()
  predictionEnabled = document.getElementById('predictionToggle').checked
}

const confidenceChanged = function() {
  confidenceThreshold = document.getElementById('confidenceSlider').value
}

const historyChanged = function() {
  historyThreshold = document.getElementById('historySlider').value
  counter.history(historyThreshold)
}

const manualStreamTello = function() {
  manualKillStream = true
  streamTello()
}

const streamTello = async function(resume) {
  const btn = document.querySelector('.stream-button')
  let stopped
  if (typeof resume === 'undefined' || resume === null) {
    stopped = btn.innerText === 'Start stream'
  } else {
    stopped = !resume
  }

  if (stopped) {
    wsConnect()
    btn.innerText = 'Stop stream'
  } else {
    wsDisconnect()
    btn.innerText = 'Start stream'
  }
}

const wsConnect = async function() {
  await fetch('/streamon', { method: 'POST' })

  const l = window.location
  const wsUrl = `${l.protocol === 'https:' ? 'wss://' : 'ws://'}${l.hostname}:${
    l.port
  }/`

  jsmpegPlayer = new JSMpeg.Player(wsUrl, {
    canvas: streamCanvas,
    audio: false,
    videoBufferSize: 512 * 1024,
    preserveDrawingBuffer: true,
    onPlay: p => {
      predictionToggled()

      const main = document.getElementById('max-main-content')
      main.classList.add('tellostream')

      predictionCanvas = document.getElementById('prediction-canvas')
      predictionCanvasCtx = predictionCanvas.getContext('2d')

      predictStream()
    }
  })
}

const wsDisconnect = async function() {
  await fetch('/streamoff', { method: 'POST' })

  const main = document.getElementById('max-main-content')
  main.classList.remove('tellostream')
}

const predictStream = async function() {
  if (predictionEnabled && model) {
    // console.time('predict')
    const predictions = await model.detect(streamCanvas)
    // console.timeEnd('predict')
    // console.log(predictions)
    // render predictions above confidence threshold
    const filteredPredictions = predictions.filter(pred => {
      return pred.score >= confidenceThreshold
    })

    renderPredictions(filteredPredictions)
    try {
      renderCounts(counter.tally(filteredPredictions))
    } catch (e) {
      console.error(e)
    }
  }

  // setTimeout(runPrediction, 200)
  requestAnimationFrame(predictStream)
}

const renderPredictions = predictions => {
  const videoCanvas = document.getElementById('stream-canvas')
  predictionCanvas.width = videoCanvas.width
  predictionCanvas.height = videoCanvas.height

  predictionCanvasCtx.clearRect(
    0,
    0,
    predictionCanvas.width,
    predictionCanvas.height
  )

  const font = '16px sans-serif'
  predictionCanvasCtx.font = font
  predictionCanvasCtx.textBaseline = 'top'
  predictions.forEach(prediction => {
    const x = prediction.bbox[0]
    const y = prediction.bbox[1]
    const width = prediction.bbox[2]
    const height = prediction.bbox[3]
    const label = `${prediction.class}: ${prediction.score.toFixed(2)}`

    predictionCanvasCtx.strokeStyle = '#FFFF3F'
    predictionCanvasCtx.lineWidth = 5
    predictionCanvasCtx.strokeRect(x, y, width, height)

    predictionCanvasCtx.fillStyle = '#FFFF3F'
    const textWidth = predictionCanvasCtx.measureText(label).width
    const textHeight = parseInt(font, 10) // base 10
    predictionCanvasCtx.fillRect(x, y, textWidth + 4, textHeight + 4)
  })

  predictions.forEach(prediction => {
    const x = prediction.bbox[0]
    const y = prediction.bbox[1]
    const label = `${prediction.class}: ${prediction.score.toFixed(2)}`

    predictionCanvasCtx.fillStyle = '#000000'
    predictionCanvasCtx.fillText(label, x, y)
  })
}

const renderCounts = function(totalCounts) {
  Object.keys(totalCounts).forEach(k => {
    document.getElementById(`${k}-count`).innerText = totalCounts[k]
  })
}

const cleanup = function() {
  counter.reset()
  document.body.className = ''

  if (predictionCanvasCtx) {
    predictionCanvasCtx.clearRect(
      0,
      0,
      predictionCanvas.width,
      predictionCanvas.height
    )
  }
}

const setState = function(state) {
  const buttons = document.getElementsByTagName('button')
  const selects = document.getElementsByTagName('select')
  const inputs = document.getElementsByTagName('input')

  const elements = [...buttons, ...selects, ...inputs]

  for (const elt of elements) {
    if (state === 'busy') {
      elt.setAttribute('disabled', true)
    } else {
      elt.removeAttribute('disabled')
    }
  }

  document.body.className = state || ''
}

const batteryCheck = async function() {
  const res = await fetch('/battery')
  const text = await res.text()
  const percentage = parseInt(text.trim(), 10)
  if (percentage) {
    document.getElementById('battery-level').style.width = `${percentage}%`
    if (percentage > 20) {
      document.getElementById('battery-level').style.background = '#53d769'
    } else {
      document.getElementById('battery-level').style.background = 'red'
    }
    document.getElementById('not-connected').style.display = 'none'
    document.getElementById('battery').style.display = 'block'
  } else {
    document.getElementById('not-connected').style.display = 'block'
    document.getElementById('battery').style.display = 'none'
  }
}

const init = function() {
  objectDetector.load('/model_web').then(loadedModel => {
    model = loadedModel
  })

  streamCanvas = document.getElementById('stream-canvas')
  counter = droneaidCounter([
    'children',
    'ok',
    'water',
    'firstaid',
    'sos',
    'shelter',
    'elderly',
    'food'
  ], historyThreshold)
  predictionToggled()
  setState()
  setInterval(batteryCheck, 5 * 1000)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}

const exampleSocket = new WebSocket('ws://localhost:3001/')

exampleSocket.onmessage = function(event) {
  if (!manualKillStream) {
    if (!document.getElementById('predictionToggle').checked) {
      document.getElementById('predictionToggle').checked = true
      predictionToggled()
    }
    if (document.querySelector('.stream-button').innerText === 'Start stream') {
      streamTello()
    }
  }

  // console.log(event)
}

let speed = 100 // 0 -> 100
let leftRight = 0
let forwardBackward = 0
let upDown = 0
let yaw = 0

window.addEventListener('keydown', e => {
  e.preventDefault()

  if (e.code === 'KeyQ') {
    exampleSocket.send('land')
    return
  }

  if (e.code === 'Enter') {
    exampleSocket.send('takeoff')
    return
  }

  if (e.code === 'ArrowLeft') {
    leftRight = `-${speed}`
  }
  if (e.code === 'ArrowRight') {
    leftRight = `${speed}`
  }
  if (e.code === 'ArrowUp') {
    forwardBackward = `${speed}`
  }
  if (e.code === 'ArrowDown') {
    forwardBackward = `-${speed}`
  }
  if (e.code === 'KeyW') {
    upDown = `${speed}`
  }
  if (e.code === 'KeyS') {
    upDown = `-${speed}`
  }
  if (e.code === 'KeyA') {
    yaw = `-${speed}`
  }
  if (e.code === 'KeyD') {
    yaw = `${speed}`
  }
  exampleSocket.send(`rc ${leftRight} ${forwardBackward} ${upDown} ${yaw}`)
})

window.addEventListener('keyup', e => {
  e.preventDefault()
  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
    leftRight = 0
  }
  if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
    forwardBackward = 0
  }
  if (e.code === 'KeyW' || e.code === 'KeyS') {
    upDown = 0
  }
  if (e.code === 'KeyA' || e.code === 'KeyD') {
    yaw = 0
  }
  exampleSocket.send(`rc ${leftRight} ${forwardBackward} ${upDown} ${yaw}`)
})
