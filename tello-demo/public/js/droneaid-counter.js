;(function() {
  let maxPredictionsHistory = 10
  let previousPredictions = []
  const totalCounts = {}

  const intersects = function(a, b) {
    if (a.class === b.class) {
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
    } else {
      return false
    }
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
          const exists = previousPredictions.flat().some(prev => {
            return intersects(prev, pred)
          })
          if (exists) {
            foundBoxes.push(pred)
          } else {
            totalCounts[pred.class]++
            newBoxes.push(pred)
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
  counter.history = function(size) {
    if (size) {
      maxPredictionsHistory = size
    }
  }
  window.droneaidCounter = counter
})()
