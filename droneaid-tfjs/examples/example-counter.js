(function () {
  let maxPredictionsHistory = 10
  let previousPredictions = []
  const totalCounts = {}

  const intersects = function (a, b) {
    if (a.label === b.label) {
      // [xmin, ymin, xmax, ymax]
      const aLeftOfB = a[2] < b[0]
      const aRightOfB = a[0] > b[2]
      const aAboveB = a[1] > b[3]
      const aBelowB = a[3] < b[1]

      return !(aLeftOfB || aRightOfB || aAboveB || aBelowB)
    } else {
      return false
    }
  }

  const tally = function (predictions) {
    if (predictions && predictions.length) {
      if (!previousPredictions.length) {
        predictions.forEach(pred => {
          totalCounts[pred.label]++
          previousPredictions.push(pred)
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
            totalCounts[pred.label]++
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

  const reset = function () {
    previousPredictions = []

    Object.keys(totalCounts).forEach(l => {
      totalCounts[l] = 0
    })
  }

  const counter = function (labels, size) {
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
  counter.maxHistory = maxPredictionsHistory

  window.droneaidCounter = counter
}())
