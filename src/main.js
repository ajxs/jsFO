"use strict";

window.addEventListener("load", main_init);

function main_init() {

	if(!browser_test()) {		// test for browser compatibility
		console.log("main: Browser failed compatibility test");

		return;
	}


	_canvas = document.getElementById('mainCanvas');
	_canvas.style.cursor = "none";


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
	skilldexState = new SkilldexState();
	contextMenuState = new ContextMenuState();
	inventoryState = new InventoryState();
	characterScreenState = new CharacterScreenState();
	pipboyState = new PipboyState();
	mapScreenState = new MapScreenState();

	main_setResolution(640,480);	// set after init states

	switch(_renderMethod) {
		case 'js':
			main_init_js();
			break;
		case 'gl':
			main_init_gl();
			break;
	};


	callFrame(main_loop);	// init loop
	_canvas.focus();

	main_loadMain();
	mainState.console.print("Welcome to jsFO!");
};


function main_init_js() {
	_context = _canvas.getContext("2d");
	_context.imageSmoothingEnabled = false;
};


function main_loadMain() {
	stateQ.push(mainLoadState);
	mainLoadState.init();
};


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
};


function main_update() {
	fps_currentTime = Date.now();

	for(var i = 0; i < stateQ.length; i++) {
		if(!stateQ[i].statePause) stateQ[i].update.call(stateQ[i]);
	}

};


function main_render() {

	for(var i = 0; i < stateQ.length; i++) {
		stateQ[i].render.call(stateQ[i]);
	}

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, _screenWidth, _screenHeight, 0, gl.ALPHA, gl.UNSIGNED_BYTE, _screenBuffer);
	gl.drawArrays(gl.TRIANGLES, 0, gl_positions.length / 2);

};


function main_setResolution(width,height) {		// realtime resolution change
	_screenWidth = width;
	_screenHeight = height;

	_canvas.width = width;
	_canvas.height = height;

	document.getElementById("main").style.width = width;

	mainState.interfaceRect.x = ((_screenWidth / 2)|0) - 320;
	mainState.interfaceRect.y = _screenHeight - 99;

	skilldexState.x = _screenWidth  - 190;
	skilldexState.y = 5;

	inventoryState.x = ((_screenWidth / 2)|0) - 250;
	inventoryState.y = 0;

	mainState.console.x = (((_screenWidth / 2)|0) - 320) + 30;	// recompute coords
	mainState.console.y = _screenHeight - 26;

	mapScreenState.x = (((_screenWidth / 2)|0) - 260);
	mapScreenState.y = 0;


	ingameMenuState.menu.x = ((_screenWidth/2)|0) - 82;
	ingameMenuState.menu.y = ((_screenHeight/2)|0) - 108;

	mainMenuState.menu.x = (_screenWidth*0.05)|0;
	mainMenuState.menu.y = (_screenWidth*0.185)|0;

	mainState.camera.trackToCoords(mainState.mapGeometry.h2s(mainState.player.hexPosition));

};

function main_openInventory() {
	mainState.statePause = true;
	inventoryState.playerAnimLastRotationTime = getTicks();
	stateQ.push(inventoryState);

};

function main_closeInventory() {
	mainState.statePause = false;
	stateQ.splice(stateQ.indexOf(inventoryState),1);

};

function main_openContextMenu(obj,x,y) {
	mainState.statePause = true;
	contextMenuState.objectIndex = obj;
	contextMenuState.x = x;
	contextMenuState.y = y;
	contextMenuState.prevX = _mouse.x;
	contextMenuState.prevY = _mouse.y;

	contextMenuState.activeItems = [];		// reset active items

	var targetObject = mainState.mapObjects[mainState.player.currentElevation][obj];

	switch(mainState.getObjectType(targetObject.objectTypeID)) {
		case "items":
			contextMenuState.activeItems.push(contextMenuState.menu_get);
			contextMenuState.activeItems.push(contextMenuState.menu_look);
			contextMenuState.activeItems.push(contextMenuState.menu_inven);
			contextMenuState.activeItems.push(contextMenuState.menu_skill);
			break;
		case "critters":
			contextMenuState.activeItems.push(contextMenuState.menu_talk);
			contextMenuState.activeItems.push(contextMenuState.menu_look);
			contextMenuState.activeItems.push(contextMenuState.menu_inven);
			contextMenuState.activeItems.push(contextMenuState.menu_skill);
			break;
		case "scenery":
		case "walls":
		case "tiles":
		case "misc":
			contextMenuState.activeItems.push(contextMenuState.menu_look);
			break;
		default:
			break;
	}

	if(targetObject.hasOwnProperty('openState')) {	// if door
		contextMenuState.activeItems.unshift(contextMenuState.menu_use);
	}

	contextMenuState.activeItems.push(contextMenuState.menu_cancel);

	stateQ.push(contextMenuState);

};

function main_closeContextMenu() {
	if(mainState.statePause) mainState.statePause = false;
	stateQ.splice(stateQ.indexOf(contextMenuState),1);
};

function main_ingameMenu() {
	mainState.statePause = true;
	stateQ.push(ingameMenuState);
	_keyboardStates[27] = false;	// LOL - sets ESC key state to false to prevent the next iteration of the gamestate stack from capturing the input.
};

function main_ingameMenu_close() {
	if(mainState.statePause) mainState.statePause = false;
	stateQ.splice(stateQ.indexOf(ingameMenuState),1);
};

function main_openSkilldex() {
	mainState.statePause = true;
	stateQ.push(skilldexState);
	_keyboardStates[27] = false;	// LOL - sets ESC key state to false to prevent the next iteration of the gamestate stack from capturing the input.
};

function main_closeSkilldex() {
	if(mainState.statePause) mainState.statePause = false;
	stateQ.splice(stateQ.indexOf(skilldexState),1);
};

function main_openCharacterScreen() {
	mainState.statePause = true;
	stateQ.push(characterScreenState);
};

function main_closeCharacterScreen() {
	if(mainState.statePause) mainState.statePause = false;
	stateQ.splice(stateQ.indexOf(characterScreenState),1);
};

function main_openPipboy() {
	mainState.statePause = true;
	stateQ.push(pipboyState);

};

function main_closePipboy() {
	if(mainState.statePause) mainState.statePause = false;
	stateQ.splice(stateQ.indexOf(pipboyState),1);
};


function main_openMap() {
	mainState.statePause = true;
	stateQ.push(mapScreenState);

};

function main_closeMap() {
	if(mainState.statePause) mainState.statePause = false;
	stateQ.splice(stateQ.indexOf(mapScreenState),1);
};
