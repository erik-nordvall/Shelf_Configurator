# Shelf Configurator
Welcome to the shelf configurator repo! This repo is an example of how to create a configurator in Three.js with a gui from dat.gui. It is intended to be used with existing stl of gltf models. In this implementation there are some native geometries as well to show how they can be implemented. Below is a brief description of each of the classes and how they work together. This example is created for the [Design Automation Lab](https://liu.se/en/research/design-automation-lab) at the division of product realisation at Linköping University.

## Get started ##
How to run the example:
* Make sure your machine has node.js installed
* Download/clone this repo to a folder on your machine
* Open repo in IDE
* Make sure your machine has Webpack installed  for example by typing in ``` npm install --save-dev webpack ``` in the IDE terminal
* After Webpack is installed, type in ``` npm install ``` to install all packages
* Once all packages are installed you can run ``` npm run dev ```
* To terminate the local server, type ctrl + C in the IDE terminal

Overview of how the configurator works:
* The pre-existing stl models are the feet, the connector A and the connector B. These all exist in three different versions, a 20mm, a 25mm and a 28mm version
* Upon start, all resources are loaded, this is done in the Resources.js class that then sends a 'ready' trigger to the main experience
* Once everything is ready the bookcase is instantiated with default parameter values and the GUI is created
* When a change occurs is the GUI it calls a function that first destroys the current shelf and then creates a new one with the new parameter values.

## Class descriptions ##
### Bookcase.js ###
In this class each of the individual components of the bookcase are instantiated. Bookcase.js has three main functions; ``` baseFrame() ```, ``` addShelf() ``` and ``` destroy() ```. ``` baseFrame() ``` is called in the ``` constructor() ``` and generates the main structure of the bookcase; the frame of dowels and the top and bottom shelf. The addShelf() function adds an additional shelf to the bookcase at a specific height. How the ``` baseFrame() ``` and ``` addShelf() ``` function look is specific for this project and need to be adapted in order to adapt to your own project.

The ``` destroy() ``` function takes all contents from an array called meshes and disposes of their geometry and material. This destroy function is general and can be reused.

### Resources.js ###
In this class all required loaders are instantiated and all objects in the sources.js file are loaded in their specific loader. Once everything is loaded a trigger is sent to the Experience.js class indicating that everything that needs to be loaded has loaded successfully.

### Sources.js ###
This file contains an array of objects. Each object represents what needs to be loaded and contains; a unique name, the type of file and the file path.

### World.js ###
The world listens to the "ready" command sent by the Resource class. This class is where the bookcase is instantiated. It is also where the parameters for the bookcase are set and the GUI is created. 

### Experience.js ###
The experience is the entire scene and all that is contained within it. The world (i.e all geometries and materials), lights, camera and renderer etc. This needs to be created in the script.js file.

### Bookcase Components folder ###
All components follow a similar structure for how the class is defined. Each class contains four functions that are called in the constructor. These four functions are; ``` setGeometry() ```, ``` setTextures() ```, ``` setMaterial() ``` and ``` setMesh() ```. 
#### ConnectorA.js ####
Loaded STL geometry for 3D printed connectors. The required inputs are the x, y, z coordinates, flip and diameter. The flip parameter is used to mirror the instantiated part. The diameter input it used 
#### ConnectorB.js ####
Loaded STL geometry for 3D printed connectors. The required inputs are the x, y, z coordinates, flip and diameter. The flip parameter is used to mirror the instantiated part.
#### Feet.js ####
Loaded STL geometry for 3D printed feet. The required inputs are the x, y, z coordinates and diameter. 
#### Legs.js ####
Native three.js cylinder geometry. The required inputs are the height, diamter and x, y, z coordinates for a individual leg.
#### RodA.js ####
Native three.js cylinder geometry. The required inputs are the height, diamter and x, y, z coordinates for a individual leg.
#### RodBjs ####
Native three.js cylinder geometry. The required inputs are the height, diamter and x, y, z coordinates for a individual leg.
#### Shelf.js ####

## Create your own ##
Below is a brief description of what needs to be changed in order to create your own configurator.

## Future Developments ##
Three.js TransformControls

https://bruno-simon.com/
