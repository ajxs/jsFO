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

	mainState = new MainState();
	loadState = new LoadState();
	mainLoadState = new MainLoadState();
	mainMenuState = new MainMenuState();
	ingameMenuState = new IngameMenuState();	// init in mainState
	
	main_setResolution(640,480);	// set after init states
	
	callFrame(main_loop);	// init loop	
	_canvas.focus();
	
	newGame.player = new Actor();
	newGame.player.PID = 0;
	newGame.player.objectTypeID = 1;
	newGame.player.objectID = 0;

	newGame.player.FID = 16777227;		// hmjmpsaa
	newGame.player.frmTypeID = 0;
	newGame.player.frmID = 0;	

	
	main_loadMain();
}


function main_loadMain() {
	stateQ.push(mainLoadState);
	mainLoadState.init();
}

function main_menu() {
	main_ingameMenu_close();
	
	var mainLoadState_index = stateQ.indexOf(mainLoadState);
	if(mainLoadState_index > -1) {	//	remove mainState
		stateQ.splice(mainLoadState_index,1);			
	}
	
	var loadState_index = stateQ.indexOf(loadState);
	if(loadState_index > -1) {	//	remove mainState
		stateQ.splice(loadState_index,1);			
	}
	
	var mainState_index = stateQ.indexOf(mainState);
	if(mainState_index > -1) {	//	remove mainState
		stateQ.splice(mainState_index,1);			
	}
	
	stateQ.push(mainMenuState);	
}

var newGame = {
	map: "geckpwpl.map",
	playerStartPos: "default",
	playerStartOrientation: "default",
	playerStartElevation: "default",
	
	player: 0,	// populate this on game init
	
};

function main_loadGame(_saveState) {
	main_ingameMenu_close();
	
	var mainMenuState_index = stateQ.indexOf(mainMenuState);
	if(mainMenuState_index > -1) {	//	remove mainState
		stateQ.splice(mainMenuState_index,1);			
	}
	
	var mainState_index = stateQ.indexOf(mainState);
	if(mainState_index > -1) {	//	remove mainState
		stateQ.splice(mainState_index,1);			
	}
	
	var loadState_index = stateQ.indexOf(loadState);
	if(loadState_index > -1) {	//	remove mainState
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
	if(ingameMenuState_index > -1) {	//	remove mainState
		stateQ.splice(ingameMenuState_index,1);
	}
};


function main_input(e) {
	e.preventDefault();

	switch(e.type) {
		case "mousemove":
			var rect = _canvas.getBoundingClientRect();
			_mouse.x = (e.clientX - rect.left)|0;
			_mouse.y = (e.clientY - rect.top)|0;			
			break;
		case "mousedown":
			if(e.which == 1) {
				_mouse.c1 = true;
			} else if(e.which == 3) _mouse.c2 = true;
			break;
		case "mouseup":
			if(e.which == 1) _mouse.c1 = false;
			else if(e.which == 3) _mouse.c2 = false;
			break;
		case "keydown":
			_keyboardStates[e.which] = true;
			break;
		case "keyup":
			_keyboardStates[e.which] = false;
			break;
		case "click":
			break;
	};
	
	for(var i = 0; i < stateQ.length; i++) {
		if(!stateQ[i].statePause) stateQ[i].input.call(stateQ[i],e);		
	}
	
	return false;
}


function main_update() {
	fps_currentTime = Date.now();

	for(var i = 0; i < stateQ.length; i++) {
		if(!stateQ[i].statePause) stateQ[i].update.call(stateQ[i]);		
	}
	
}


function main_render() {
	//_context.fillStyle = _context_clearcolour;	// optional clear
	//_context.fillRect(0,0,_screenWidth,_screenHeight);
	_canvas.width = _screenWidth;

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
	
	mainMenuState.menu.x = (_screenWidth*0.05)|0;
	mainMenuState.menu.y = (_screenWidth*0.185)|0;
	
	mainState.camera.trackToCoords(mainState.mapGeometry.h2s(mainState.player.hexPosition));
	
}