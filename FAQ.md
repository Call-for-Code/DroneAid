# Frequently asked questions

**Will developers be leveraging IBM Watson and Cloud if they contribute?**

Yes. They will be using IBM Watson to train the machine learning model as well as [Cloud Object Storage](https://cloud.ibm.com/catalog/services/cloud-object-storage) to store the training data. We’re using the [Cloud Annotations tool](https://github.com/cloud-annotations/training), an open source project by [Nick Bourdakos](https://github.com/bourdakos1), to easily train the model and that will be using IBM Cloud Object Storage.

**What type of drones can we leverage here?**

Any and every drone that can capture a video stream can be used for the purposes of DroneAid. Since the machine learning model uses Tensorflow.js in the browser, we can capture the stream from any type of drone and apply inference from that stream. Right now, we have a tech demo that runs with small Tello drones. 

**Why are you open sourcing DroneAid?**

I decided to make DroneAid open source for a few reasons: 

First, because Drone Aid is meant to be a helpful tool in the event of a natural disaster, it is paramount to make it available to as many people as we possibly can. The more talented developers who are using, tweaking, and training the software, the better and more efficient it will become.

Second, I want other developers to be inspired to take action and create solutions for natural disaster response that may work better for them; perhaps others can train something similar to DroneAid for other scenarios, such as wildfires, earthquakes, and search and rescue ops.

Third, and on a more personal note, over the past 7 years as a professional developer, I have used many open source libraries and feel indebted to the community. I want to give back to this community that gave me so much.

And finally, my goal is to build the foundations for a fleet of drones that can help in natural disasters. What better way to do this than opening DroneAid up to the world and having people contribute with their own experiences?

**Can devs can get involved right away? If so, where can they go to get started?**

Yes! Anyone with a Tello drone can use this code base as a proof of concept and can train their own models immediately, not only with the SOS icons that we use, but also with their own objects. Go to the GitHub link to get started: [https://github.com/code-and-response/droneaid](https://github.com/code-and-response/droneaid).

**Is the goal to use DroneAid around the world?**

Yes, the goal is to create the foundation for other developers, so that they can come up with different applications for DroneAid in a wide variety of scenarios and landscapes. I want to test it in Puerto Rico, but I wouldn't want it to be used exclusively in the Caribbean.

**How can open source advance this work quickly? What particular code contributions are you looking for?**

By making it open source, people can build a pilot with their own uses cases. DroneAid as a project is very ambitious, and it will require dozens of developers to bring it to fruition. What better way to improve this software than by collaborating with people from around the world? By crowdsourcing damage assessment and data collection after a natural disaster, it will certainly improve the machine learning model by creating a larger library of visual images.

We're looking for contributions that will help us improve and iterate DroneAid. Right now, the system works with a video stream where DroneAid would benefit from being built into consumer drones, or custom "DroneAid" drones that are used specifically for natural disaster response. 

Ultimately, the goal would be to have an automated fleet of drones that would launch right after a disaster, where they wouldn't require pilots and would use alternative communications systems (like [Project OWL](http://www.project-owl.com/)). 

**How is DroneAid different from other projects?**

It is important to keep in mind that DroneAid is a video-streaming, analyzing tool and vision system; it analyses video stream to detect SOS messages from the air. In this sense, DroneAid is unique. 
