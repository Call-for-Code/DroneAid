/* global tf */

import { labels } from './droneaid-labels.js'

const maxNumBoxes = 10
const iouThreshold = 0.5
const scoreThreshold = 0.3

const calculateMaxScores = (scores, numBoxes, numClasses) => {
  const maxes = []
  const classes = []
  for (let i = 0; i < numBoxes; i++) {
    let max = Number.MIN_VALUE
    let index = -1
    for (let j = 0; j < numClasses; j++) {
      if (scores[i * numClasses + j] > max) {
        max = scores[i * numClasses + j]
        index = j
      }
    }
    maxes[i] = max
    classes[i] = index
  }
  return [maxes, classes]
}

const formatResponse = (indexes, boxes, classes, maxScores) => {
  const objects = []

  for (let i = 0; i < indexes.length; i++) {
    const idx = indexes[i]
    const bbox = boxes[idx][0]

    objects.push({
      'class': classes[idx],
      'score': maxScores[idx],
      'bbox': bbox.map(b => Math.max(0, +(b.toFixed(4)))),
      'label': labels[classes[idx]]
    })
  }

  return objects
}

/**
 * convert model Tensor output
 *
 * @param {Tensor} inferenceResults - the output from running the model
 */
const postprocess = function (inferenceResults, options) {
  return new Promise(async (resolve, reject) => {
    // console.time('postprocess')
    let minScore = scoreThreshold
    let iou = iouThreshold
    let maxBoxes = maxNumBoxes

    if (options) {
      minScore = options.scoreThreshold || scoreThreshold
      iou = options.iouThreshold || iouThreshold
      maxBoxes = options.maxNumBoxes || maxNumBoxes
    }

    const scores = await inferenceResults[0].data()
    const boxes = inferenceResults[1].unstack()[0]

    tf.dispose(inferenceResults)

    const [maxScores, classes] = calculateMaxScores(scores, inferenceResults[0].shape[1], inferenceResults[0].shape[2])
    const boxes2 = boxes.reshape([boxes.shape[0], boxes.shape[2]])
    const boxes3 = await boxes.array()

    boxes.dispose()

    const indexTensor = await tf.image.nonMaxSuppressionAsync(
      boxes2,
      maxScores,
      maxBoxes,
      iou,
      minScore
    )

    const indexes = await indexTensor.data()

    boxes2.dispose()
    indexTensor.dispose()

    // console.timeEnd('postprocess')
    resolve(formatResponse(indexes, boxes3, classes, maxScores))
  })
}

export { postprocess }
