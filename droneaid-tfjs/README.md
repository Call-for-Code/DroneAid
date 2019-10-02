# DroneAid for TensorFlow.js

This is a TensorFlow.js port of the **DroneAid** pre-trained model. The DroneAid model was trained to identify specific emergency status symbols in times of natural disasters.

## Build

1. Clone this repository
   ```
   $ git clone https://github.ibm.com/callforcode/DroneAid.git
   ```  
1. Change to `droneaid-tfjs` directory
   ```
   $ cd DroneAid/droneaid-tfjs
   ```  
1. Install dependencies & build package
   ```
   $ npm install
   $ npm run build
   ```

A `dist/` directory is created and populated with different JavaScript versions of the library (e.g., `droneaid-tfjs.js`)

## Install

### Browser

```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
<script src="dist/droneaid-tfjs.js"></script>
```

## Use

The [`/examples`](examples) directory contains sample code.

> **Note**: _When loaded in a browser, the global variable `droneaid` will be available to access the API._

```javascript
let image = document.getElementById('my-image')

droneaid
  .predict(image)
  .then(predictions => {
    console.log(predictions)
  })
```

### API

- **loadModel(_init_)**

  Loads the model files.

  `init` - if `true`, a prediction will be triggered using an all zero Tensor to warm up the model (helps increase speed of subsequent predictions when running in a browser). Default is `true`.

  Returns the TensorFlow.js model.

- **processInput(_image_)**

  Processes the input image to the shape and format expected by the model. The image is resized and converted to a 4D Tensor.

  `image` - an instance of HTMLImageElement, HTMLCanvasElement, or HTMLVideoElement.

  Returns a 4D Tensor that can be passed to the model.

- **runInference(_inputTensor_)**

  Runs inference on the input Tensor passed. The output is an array with 2 Tensors the bounding box and corresponding scores of identified symbols.

  `inputTensor` - a 4D Tensor representing an ImageData

  Returns the inference results.

- **processOutput(_inferenceResults_)**

  Processes the inference output replacing the output Tensor with an array objects. Each object represents an detected symbol

  `inferenceResults` - the model output from running inference.

  Returns an array of objects containing

  - `class`: a number representing the symbol id
  - `score`: a number for the confidence score
  - `bbbox`: the bounding box (i.e., `[x0, y0, x1, y1]`) for the symbol where `x` and `y` are the corners of the bounding box (as percentages of the input image's width and height)
  - `label`: the symbol name

- **predict(_image_)**

  Loads the model (if not loaded), processes the input image, runs inference, processes the inference output, and returns a prediction object. This is a convenience function to avoid having to call each of the functions (`loadModel`, `processInput`, `runInference`, `processOutput`) individually.

  `image` - an instance of HTMLImageElement, HTMLCanvasElement, or HTMLVideoElement.

  Returns an array of objects containing

  - `class`: a number representing the symbol id
  - `score`: a number for the confidence score
  - `bbbox`: the bounding box (i.e., `[x0, y0, x1, y1]`) for the symbol where `x` and `y` are the corners of the bounding box (as percentages of the input image's width and height)
  - `label`: the symbol name

- **labels()**

  An array of labels (i.e., symbol names) where the label's index corresponds to its id.

- **version**

  Returns the version

## Model

The model assets produced by converting the pre-trained model to the TensorFlow.js format can be found in the [`/model_web`](model_web) directory.

## Links

- [DroneAID: Visual recognition helps hurricane victims](https://developer.ibm.com/blogs/droneaid-visual-recognition-helps-hurricane-victims/)
- [Call for Code](https://developer.ibm.com/callforcode/)
- [TensorFlow.js](https://www.tensorflow.org/js/)

## License

[Apache-2.0](https://github.com/CODAIT/max-tfjs-models/blob/master/LICENSE)
