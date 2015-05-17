# jsFO
jsFO is an open-source port of Interplay's Fallout2 to the browser.
jsFO is written in Javascript, using the HTML5 canvas API for rendering, and is compatible with all modern browsers. jsFO uses a python based backend for conversion from Fallout's native file formats to browser compatible JSON files.
At present time of writing, jsFO is in a pre-alpha state and has limited playability.
In order to run the port, you will need to convert the game's data files to jsFO's native formats. Details of how to achieve this will be provided in the wiki. Sample data files will be provided for testing purposes.

Presently, the end goal of this project is not to create a complete, playable port of FO2 in the browser, but rather to create a technical demo to showcase the HTML5's capabilities as a game design platform, and to create a solid foundation of code from which other developers interested in Fallout mods or ports could create other projects. 
All Source Code relating to the conversion of Fallout's original assets, as well as relevant documentation regarding the file formats and the specifics Fallout's engine will be recorded in this project's wiki, feel free to contact the team with any specific questions regarding these formats. 

jsFO is 'free as in speech', so feel free to fork the project or contribute to it's development in any way. If you are interested in contributing to the main branch of jsFO, feel free to contact the team via this site.

##Running jsFO
To run jsFO for yourself, simply download the src to your computer and run index.html. 
Data files used to run the game are stored in the /jsfdata/ folder. To convert and run other maps in jsFO, run the 'loader_main.py' script contained in the /loader/ folder, use --map=<map> and --output=<outputfile> to convert a map to jsFO's native json format. To convert maps you'll need to unzip the contents of Fallout2's master.dat file, then modify 'loader_gamestate.py' and 'loader_map.py' to point to the location of the root directory of the Fallout data files. This can be achieved by modifying the 'urlprefix' variable in both files.
After doing this, to load a different map, modify 'main.js' and 'LoadState.js' to alter the map the engine will load be default. Change the map variable in the newGame object in main.js, and add a new case in 'LoadState' to point to the resulting file made by the converter script.