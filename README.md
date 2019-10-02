# DroneAid

## Visually recognize standard icons to respond to needs after a disaster

<img src="img/droneaid-logo.png" height="100" alt="DroneAid logo"> 

DroneAid uses machine learning to detect calls for help on the ground placed by those in need. At the heart of DroneAid is a *Symbol Language* that is used to train a visual recognition model. That model analyzes video from a drone to detect and count specific images. A dashboard can be used to plot those locations on a map and initiate a response.

The current implementation can be extended beyond a particular drone to additional drones, airplanes, and satellites. The Symbol Language can be used to train additional visual recognition implementations.

DroneAid was created by Pedro Cruz in August 2018 and released as a *Code and Response™ with The Linux Foundation* open source project in October 2019. DroneAid is currently being transferred to The Linux Foundation.

* [The DroneAid origin story](#the-droneaid-origin-story)
* [DroneAid Symbol Language](#droneaid-symbol-language)
* [See it in action](#see-it-in-action)
* [Set up and training a visual recognition model on the Symbol Language](#set-up-and-training-a-visual-recognition-model-on-the-symbol-language)
* [Frequently asked questions](#frequently-asked-questions)
* [Project roadmap](#project-roadmap)
* [Built with](#built-with)
* [Contributing](#contributing)
* [Authors](#authors)
* [License](#license)

## The DroneAid origin story
[![DroneAid](https://img.youtube.com/vi/9fRcis-5Zuc/0.jpg)](https://www.youtube.com/watch?v=9fRcis-5Zuc)

## DroneAid Symbol Language

The DroneAid Symbol Language provides a way for those affected by natural disasters to express their needs and make them visible to drones, planes, and satellites when traditional communications are not available. 

Victims can use a pre-packaged symbol kit that has been manufactured and distributed to them, or recreate the symbols manually with whatever materials they have available.

These symbols include those below, which represent a subset of the icons provided by [The United Nations Office for the Coordination of Humanitarian Affairs (OCHA)](https://www.unocha.org/story/ocha-launches-500-free-humanitarian-symbols).

| Symbol | Meaning | Symbol | Meaning |
|--------|--------- |--------|---------|
| <img src="img/icons/icon-sos.png" width="100" alt="SOS"> | Immediate Help Needed | <img src="img/icons/icon-shelter.png" width="100" alt="Shelter"> | Shelter Needed |
| <img src="img/icons/icon-ok.png" width="100" alt="OK"> | No Help Needed | <img src="img/icons/icon-firstaid.png" width="100" alt="FirstAid">| First Aid Kit Needed |
| <img src="img/icons/icon-water.png" width="100" alt="Water"> | Water Needed | <img src="img/icons/icon-children.png" width="100" alt="Children">| Area with Children in Need |
| <img src="img/icons/icon-food.png" width="100" alt="Food"> | Food Needed | <img src="img/icons/icon-elderly.png" width="100" alt="Elderly"> | Area with Elderly in Need |


## See it in action

Take these steps to view the live demo:

1. [Download](img/icons/icon-sos.png) or take a picture of one of the DroneAid symbols with your phone.
2. Go to [droneaid.io](https://droneaid.io) on your computer.
3. Activate your computer's camera.
4. Test out the tracking by pointing the image on your phone at the computer's camera.

Alternatively, you can print out the images and use them in place of the phone's screen.

## Set up and training a visual recognition model on the Symbol Language

In order to train the model, we must place the symbols into simulated environments so that the system knows how to detect them in a variety of conditions (i.e. whether they are distorted, faded, or in low light conditions).

See [SETUP.md](SETUP.md)

## Frequently asked questions

See [FAQ.md](FAQ.md)

## Project roadmap

See [ROADMAP.md](ROADMAP.md)

## Built with

* [TensorFlow.js](https://www.tensorflow.org/js) - Used to run inference on the browser
* [Cloud Annotations](https://github.com/cloud-annotations/training) - Used for training the model
* [Lens Studio](https://lensstudio.snapchat.com/) - Used to create the augmented reality and generate the imageset
* [Strapi](https://strapi.io/) - Internal API tool
* [Node-RED](https://nodered.org/) - Drone dashboard implementation with visual scripting

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* [Va Barbosa](https://github.com/vabarbosa)
* [Nick Bourdakos](https://github.com/bourdakos1)
* [John Walicki](https://github.com/johnwalicki)
* [Daniel Krook](https://github.com/krook)
* [Pedro Cruz](https://github.com/pedrocruzio)

## License

This project is licensed under the Apache 2 License - see the [LICENSE](LICENSE) file for details.

