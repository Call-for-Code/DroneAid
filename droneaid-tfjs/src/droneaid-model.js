/* globals tf */

// should be URL to hosted model assets (e.g., COS)
const modelPath = '/model_web/model.json'

let model = null
let warmed = false

/**
 * load the droneaid model
 */
const load = function (initialize) {
  if (!model) {
    // console.log('loading model...')
    // console.time('model load')
    return tf.loadGraphModel(modelPath)
      .then(m => {
        // console.timeEnd('model load')
        model = m
        if (istrue(initialize)) {
          warmup()
        }
        return Promise.resolve(model)
      })
      .catch(err => {
        // console.timeEnd('model load')
        console.error(err)
        return Promise.reject(err)
      })
  } else if (istrue(initialize) && !warmed) {
    warmup()
    return Promise.resolve(model)
  } else {
    return Promise.resolve(model)
  }
}

/**
 * run the model to get a prediction
 */
const run = async function (imageTensor) {
  if (!imageTensor) {
    console.error('no image provided')
    throw new Error('no image provided')
  } else if (!model) {
    console.error('model not available')
    throw new Error('model not available')
  } else {
    // console.log('running model...')
    // console.time('model inference')
    // https://js.tensorflow.org/api/latest/#tf.GraphModel.executeAsync
    // console.time('model.execute')
    const results = await model.executeAsync({
      'image_tensor': imageTensor
    })
    // console.timeEnd('model.execute')
    // console.timeEnd('model inference')
    warmed = true
    return results
  }
}

/**
 * run inference on the TensorFlow.js model
 */
const inference = function (imageTensor) {
  return load(false).then(() => {
    try {
      return run(imageTensor)
    } catch (err) {
      return Promise.reject(err)
    }
  })
}

const warmup = function () {
  try {
    run(tf.ones([1, 1024, 1024, 3]))
  } catch (err) { }
}

const istrue = function (param) {
  return param === null ||
    typeof param === 'undefined' ||
    (typeof param === 'string' && param.toLowerCase() === 'true') ||
    (typeof param === 'boolean' && param)
}

if (process.rollupBrowser) {
  const init = document.currentScript.getAttribute('data-init-model')
  if (istrue(init)) {
    load(true).then(() => {
      console.log('model initialized')
    })
  }
}

export { load, inference }
