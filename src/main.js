"use strict";

function main_init() {
	_canvas = document.getElementById('mainCanvas');
	_canvas.style.cursor = "none";

	_context = _canvas.getContext("2d");
	_context.imageSmoothingEnabled = false;
	
	document.addEventListener('mousemove', main_input);	// add input listeners
	_canvas.addEventListener('mousedown', main_input);
	_canvas.addEventListener('mouseup', main_input);
	_canvas.addEventListener('click',main_input);
	_canvas.addEventListener('contextmenu',main_input);
	
	document.addEventListener('keydown', main_input);	// declare at document scope
	document.addEventListener('keyup', main_input);
	
	var main_loop = function() {
		main_update();
		main_render();
		callFrame(main_loop);
	};
	
	if(!callFrame) {
		console.log("main: frame handler error: No frame handler!");
		return;
	}

	mainState = new mainState();
	loadState = new loadState();	
	ingameMenuState = new ingameMenuState();	// init in mainState
	
	main_setResolution(640,480);	// set after init states
	
	fps_timeStart = new Date().getTime();
	callFrame(main_loop);	// init loop	
	_canvas.focus();
	
	main_loadGame(newGame);
}

var newGame = {
	map: "geckpwpl.map",
	playerStartPos: "default",
	playerStartOrientation: "default",
	
};

function main_loadGame(_saveState) {
	mainState.initState = false;
	main_ingameMenu_close();
	
	var mainState_index = stateQ.indexOf(mainState);
	if(mainState_index > 0) {	//	remove mainState
		stateQ.splice(mainState_index,1);			
	}
	
	var loadState_index = stateQ.indexOf(loadState);
	if(loadState_index > 0) {	//	remove mainState
		stateQ.splice(loadState_index,1);			
	}
	
	stateQ.push(loadState);
	loadState.init(_saveState);
};


function main_ingameMenu() {
	mainState.statePause = true;
	mainState.contextMenuActive = false;
	stateQ.push(ingameMenuState);
	_keyboardStates[27] = false;	// LOL - sets ESC key state to false to prevent the next iteration of the gamestate stack from capturing the input.
};

function main_ingameMenu_close() {
	if(mainState.statePause) mainState.statePause = false;
	
	var ingameMenuState_index = stateQ.indexOf(ingameMenuState);
	if(ingameMenuState_index > 0) {	//	remove mainState
		stateQ.splice(ingameMenuState_index,1);			
	}
};


function main_input(e) {
	e.preventDefault();

	if(e.type == 'mousemove') {	// get mouse coords
		var rect = _canvas.getBoundingClientRect();
		_mouse.x = (e.clientX - rect.left)|0;
		_mouse.y = (e.clientY - rect.top)|0;
	} else if(e.type == 'mousedown') {	// get button states
		if(e.which == 1) {
			_mouse.c1 = true;
		} else if(e.which == 3) _mouse.c2 = true;
	} else if(e.type == 'mouseup') {
		if(e.which == 1) _mouse.c1 = false;
		else if(e.which == 3) _mouse.c2 = false;
	}
	
	else if(e.type == 'keydown') _keyboardStates[e.which] = true;
	else if(e.type == 'keyup') _keyboardStates[e.which] = false;
	
	if(e.type == 'click') {

	}
	
	for(var i = 0; i < stateQ.length; i++) {
		stateQ[i].input.call(stateQ[i],e);		
	}
	
	return false;
}

function main_input_clickHandler(e) {
	
	

}

function main_update() {
	fps_timeFrameCount++;
	fps_timeCurrent = new Date().getTime();
	fps_timeLength = (fps_timeCurrent - fps_timeStart)/1000;
	fps_framesPerSecond = Math.ceil(fps_timeFrameCount / fps_timeLength);
	
	for(var i = 0; i < stateQ.length; i++) {
		stateQ[i].update.call(stateQ[i]);		
	}
	
}


function main_render() {
	_context.fillStyle = _context_clearcolour;	// optional clear
	_context.fillRect(0,0,_screenWidth,_screenHeight);

	for(var i = 0; i < stateQ.length; i++) {
		stateQ[i].render.call(stateQ[i]);		
	}	
}


function main_setResolution(width,height) {		// realtime resolution change
	_screenWidth = width;	
	_screenHeight = height;
	
	_canvas.width = width;
	_canvas.height = height;
	
	document.getElementById("main").style.width = width;
	
	mainState.interfaceRect.x = ((_screenWidth / 2)|0) - 320;
	mainState.interfaceRect.y = _screenHeight - 99;
	
	mainState.console.x = (((_screenWidth / 2)|0) - 320) + 30;	// recompute coords 
	mainState.console.y = _screenHeight - 26;

	
	
	ingameMenuState.menu.x = ((_screenWidth/2)|0) - 82;
	ingameMenuState.menu.y = ((_screenHeight/2)|0) - 108;
	
	if(mainState.initState) {	// track to player after resize
		mainState.camera.trackToCoords(mainState.mapGeometry.h2s(mainState.player.hexPosition));		
	}
	
}