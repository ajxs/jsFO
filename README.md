# jsFO

View the online demo at: [http://ajxs.github.io/jsFO](http://ajxs.github.io/jsFO)

## Current Status
Development on jsFO has unfortunately ceased some time ago. This project began in the early 2010s as a hobby project for myself learning game development in C/SDL. Not too long after, the web as a multimedia platform entered into a brand new renaissance with the release of the HTML5 canvas API. This would provide an amazing platform for web development, making projects like this possible. I decided to embark upon a fun experiment to see if it was possible to run a game like Fallout in the browser. This project served as a fantastic learning experience for me.

In the intervening years since 2014 when this project began, the web technology ecosystem has come a long way. This project predates the wide adoption of Node.js, predates ES6, predates WebAssembly. Many design decisions in jsFO were made around problems that these technologies would later address. And certainly not to mention the fact that my skill as a developer has come a long, long way since I began this project. Looking back on some of the code quality, and lack of documentation/testing I'm more than a little embarassed.

As the project currently stands, it is for all purposes inactive. I will continue to clean up and document as much of the code as I can, in case anyone wanted to better understand it to help their own efforts. Much of the code worked extremely well and would prove useful for anyone looking to reverse engineer Fallout 2. Such as the rendering and asset parsing code, for instance.

### If you still believe in Fallout in your browser...

If you wanted to work on a similar project, here are my thoughts on how I would approach the project. First of all, I would use a staticly compiled language compiled to a WebAssembly target.
One bad design decision that haunted jsFO was to use Python scripts to interpret the Fallout2 .dat files and encode their contents in a JSON-based format that could be easily interpreted by the browser. This was a poor decision all-round. In my defense, The File API was not well developed at that point in time. I felt it was important to avoid requiring any user interaction to launch the demo. If I were to revisit the idea today I would use the File API to request a .dat file be loaded into the browser by 'drag+drop', and then interpret the binary format directly in the game code. It would be memory heavy, but much cleaner code overall.

If you, or anyone else, wanted any information on how the engine worked, or to work on the project as it exists now in any capacity I would be more than happy to assist.


## About

jsFO is an open-source port of Interplay's Fallout2 for the browser, written in Javascript, with conversion of assets from the original Fallout2 handled in Python.
jsFO uses the HTML5 canvas API for rendering, and should be compatible with all modern browsers.
At present time of writing, jsFO is in a pre-alpha state and has limited playability.
The end goal of this project is not to create a complete, playable port of FO2 in the browser, but rather to create a technical demo to showcase HTML5's capabilities as a platform for serious game design, and to create a solid foundation of code from which other developers interested in Fallout mods or ports could learn from in their work on other projects.
One end goal is eventually to document the specifics regarding the conversion of original game assets, however this is not an immediate priority for the team. Feel free to contact the team with any specific questions regarding these formats, or specific functionality of the Fallout engine.

All code for this project is released under the Apache 2.0 license, meaning that you - the end user - are free to do with the software more or less whatever you wish, but you probably won't get far selling it. You're free to deconstruct, reconstruct, repair, retouch, break and bend this software all you want. And I wish you the best of luck in doing so... you'll need it. Feel free to contribute in any way!

## ES6-Standards
jsFO uses `babel-cli` together with a GNU make build pipeline for aligning the ES6-compatible src with current web standards. The ES5-compatible branch has been fully deprecaed, and jsFO will now be using babel for transpilation during the build process.

## Running jsFO

### Dependencies
- The Node.js runtime
- NPM
- Python
- GNU Make

To run jsFO for yourself, download the game sources to your hard drive and run `make`. This will download the required Node.js modules to build the game's distributable and then build the distributable artefact. A local server can be initiated for running the game by invoking `make server`. This requires the presence of Python on the system.
The source in this hub contains pre-packaged data files for several maps, which will allow you to test the engine's functionality. To convert and run additional maps in jsFO, you will need a copy of the original game's data files, being 'master.dat' and 'critter.dat' for conversion of the game's original assets.
Scripts for asset conversion can be found in the `src/loader` folder.
