;(function() {
  let maxPredictionsHistory = 3
  let previousPredictions = []
  const totalCounts = {}

  const intersects = function(a, b) {
    const xminA = a[0]
    const yminA = a[1]
    const xmaxA = xminA + a[2]
    const ymaxA = yminA + a[3]
    const xminB = b[0]
    const yminB = b[1]
    const xmaxB = xminB + b[2]
    const ymaxB = yminB + b[3]

    const aLeftOfB = xmaxA < xminB
    const aRightOfB = xminA > xmaxB
    const aAboveB = yminA > ymaxB
    const aBelowB = ymaxA < yminB

    return !(aLeftOfB || aRightOfB || aAboveB || aBelowB)
  }

  const tally = function(predictions) {
    if (predictions && predictions.length) {
      if (!previousPredictions.length) {
        predictions.forEach(pred => {
          totalCounts[pred.class]++
          previousPredictions.push(pred.bbox)
        })
      } else {
        const newBoxes = []
        const foundBoxes = []
        predictions.forEach(pred => {
          const bbox = pred.bbox
          const exists = previousPredictions.flat().some(prev => {
            return intersects(prev, bbox)
          })
          if (exists) {
            foundBoxes.push(bbox)
          } else {
            totalCounts[pred.class]++
            newBoxes.push(bbox)
          }
        })

        if (previousPredictions.length >= maxPredictionsHistory) {
          previousPredictions.pop()
        }
        previousPredictions.unshift([...foundBoxes, ...newBoxes])
      }
    }

    return totalCounts
  }

  const reset = function() {
    previousPredictions = []

    Object.keys(totalCounts).forEach(l => {
      totalCounts[l] = 0
    })
  }

  const counter = function(labels, size) {
    if (size) {
      maxPredictionsHistory = size
    }

    if (labels) {
      labels.forEach(l => {
        totalCounts[l] = 0
      })
    }

    return counter
  }

  counter.tally = tally
  counter.reset = reset
  window.droneaidCounter = counter
})()
