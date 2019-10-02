import { preprocess } from './droneaid-input.js'
import { load, inference } from './droneaid-model.js'
import { postprocess } from './droneaid-output.js'
import { labels } from './droneaid-labels.js'
import { version } from '../package.json'

if (!process.rollupBrowser) {
  global.tf = require('@tensorflow/tfjs-node')
}

const processInput = function (inputImage, options) {
  const mirrorImage = options ? options.mirrorImage : false
  return preprocess(inputImage, mirrorImage)
}

const loadModel = function (init) {
  return load(init)
}

const runInference = function (inputTensor) {
  return inference(inputTensor)
}

const processOutput = function (inferenceResults, options) {
  return postprocess(inferenceResults, options)
}

const predict = function (inputImage, options) {
  return processInput(inputImage, options)
    .then(runInference)
    .then(outputTensor => {
      return processOutput(outputTensor, options)
    })
    .catch(err => {
      console.error(err)
    })
}

export {
  predict,
  processInput,
  loadModel,
  runInference,
  processOutput,
  labels,
  version
}
