# jsFO

View the online demo at: [http://ajxs.github.io/jsFO](http://ajxs.github.io/jsFO)

jsFO is an open-source port of Interplay's Fallout2 for the browser, written in Javascript, with conversion of assets from the original Fallout2 handled in Python.
jsFO uses the HTML5 canvas API for rendering, and should be compatible with all modern browsers.
At present time of writing, jsFO is in a pre-alpha state and has limited playability.
The end goal of this project is not to create a complete, playable port of FO2 in the browser, but rather to create a technical demo to showcase HTML5's capabilities as a platform for serious game design, and to create a solid foundation of code from which other developers interested in Fallout mods or ports could learn from in their work on other projects.
One end goal is eventually to document the specifics regarding the conversion of original game assets, however this is not an immediate priority for the team. Feel free to contact the team with any specific questions regarding these formats, or specific functionality of the Fallout engine.

All code for this project is released under the Apache 2.0 license, meaning that you - the end user - are free to do with the software more or less whatever you wish, but you probably won't get far selling it. You're free to deconstruct, reconstruct, repair, retouch, break and bend this software all you want. And I wish you the best of luck in doing so... you'll need it. Feel free to contribute in any way!

##ES6-Standards
jsFO uses babel-cli together with a GNU make build pipeline for aligning the ES6-compatible src with current web standards. The ES5-compatible branch has been fully deprecaed, and jsFO will now be using babel for transpilation during the build process.

##Running jsFO
To run jsFO for yourself, simply download the source files to your computer and run index.html. If you encounter any issues with XSS security in Chrome, you can run chrome with the command line flag --disable-web-security, alternatively running in firefox, or through a simple http host will solve these issues.
The source in this hub contains pre-packaged data files for several maps, which will allow you to test the engine's functionality. To convert and run additional maps in jsFO, you will need a copy of the original game's data files, being 'master.dat' and 'critter.dat' for conversion of the game's original assets.
Scripts for asset conversion can be found in the 'src/loader' folder.
