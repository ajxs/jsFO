"use strict";

window.addEventListener("load", main_init);

function main_init() {

	if(!browser_test()) {		// test for browser compatibility
		console.log("main: Browser failed compatibility test");

		return;
	}


	_canvas = document.getElementById('mainCanvas');
	_canvas.style.cursor = "none";

	document.getElementById("main").style.width = SCREEN_WIDTH;

	_canvas.width = SCREEN_WIDTH;
	_canvas.height = SCREEN_HEIGHT;

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
	skilldexState = new SkilldexState();
	contextMenuState = new ContextMenuState();
	inventoryState = new InventoryState();
	characterScreenState = new CharacterScreenState();
	pipboyState = new PipboyState();
	mapScreenState = new MapScreenState();

	callFrame(main_loop);	// init loop
	_canvas.focus();

	main_loadMain();
	mainState.console.print("Welcome to jsFO!");
};


function main_loadMain() {
	activeGameStates.push(mainLoadState);
	mainLoadState.init();
};


function main_menu() {
	main_gameStateFunction('closeIngameMenu');

	let mainLoadState_index = activeGameStates.indexOf(mainLoadState);
	if(mainLoadState_index > -1) {	//	remove mainState
		activeGameStates.splice(mainLoadState_index,1);
	}

	let loadState_index = activeGameStates.indexOf(loadState);
	if(loadState_index > -1) {	//	remove mainState
		activeGameStates.splice(loadState_index,1);
	}

	let mainState_index = activeGameStates.indexOf(mainState);
	if(mainState_index > -1) {	//	remove mainState
		activeGameStates.splice(mainState_index,1);
	}

	activeGameStates.push(mainMenuState);
};


function main_loadGame(_saveState) {
	main_gameStateFunction('closeIngameMenu');

	let mainMenuState_index = activeGameStates.indexOf(mainMenuState);
	if(mainMenuState_index > -1) {	//	remove mainState
		activeGameStates.splice(mainMenuState_index,1);
	}

	let mainState_index = activeGameStates.indexOf(mainState);
	if(mainState_index > -1) {	//	remove mainState
		activeGameStates.splice(mainState_index,1);
	}

	let loadState_index = activeGameStates.indexOf(loadState);
	if(loadState_index > -1) {	//	remove mainState
		activeGameStates.splice(loadState_index,1);
	}

	activeGameStates.push(loadState);
	loadState.init(_saveState);
};



function main_input(e) {
	e.preventDefault();

	switch(e.type) {
		case "mousemove":
			clientBoundingRect = _canvas.getBoundingClientRect();
			_mouse.x = (e.clientX - clientBoundingRect.left)|0;
			_mouse.y = (e.clientY - clientBoundingRect.top)|0;
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

	for(let i = 0; i < activeGameStates.length; i++) {
		if(!activeGameStates[i].statePause) activeGameStates[i].input.call(activeGameStates[i],e);
	}

	return false;
};


function main_update() {
	fps_currentTime = Date.now();

	for(let i = 0; i < activeGameStates.length; i++) {
		if(!activeGameStates[i].statePause) activeGameStates[i].update.call(activeGameStates[i]);
	}

};


function main_render() {
	_canvas.width = SCREEN_WIDTH;	// hack clear

	for(let i = 0; i < activeGameStates.length; i++) {
		activeGameStates[i].render.call(activeGameStates[i]);
	}

};



function main_openActiveState(state) {
	mainState.statePause = true;
	activeGameStates.push(state);
	_keyboardStates[27] = false;	// LOL - sets ESC key state to false to prevent the next iteration of the gamestate stack from capturing the input.
};

function main_closeActiveState(state) {
	if(mainState.statePause) mainState.statePause = false;
	let statePosition = activeGameStates.indexOf(state);
	if(statePosition) {
		activeGameStates.splice(activeGameStates.indexOf(state),1);
	} else {
		console.log("main_closeActiveState: Invalid state");
	}
};


function main_openContextMenu(obj,x,y) {
	contextMenuState.objectIndex = obj;
	contextMenuState.x = x;
	contextMenuState.y = y;
	contextMenuState.prevX = _mouse.x;
	contextMenuState.prevY = _mouse.y;

	contextMenuState.activeItems = [];		// reset active items

	let targetObject = mainState.mapObjects[mainState.player.currentElevation][obj];

	switch(getObjectType(targetObject.objectTypeID)) {
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

	main_openActiveState(contextMenuState);

};


function main_gameStateFunction(f, ...extra) {
	switch(f) {
		case "openContextMenu":
			main_openContextMenu(extra[0], extra[1], extra[2]);		//@TODO: FIX
			break;
		case "closeContextMenu":
			main_closeActiveState(contextMenuState);
			break;
		case "openInventory":
			main_openActiveState(inventoryState);
			break;
		case "closeInventory":
			main_closeActiveState(inventoryState);
			break;
		case "openIngameMenu":
			main_openActiveState(ingameMenuState);
			break;
		case "closeIngameMenu":
			main_closeActiveState(ingameMenuState);
			break;
		case "openSkilldex":
			main_closeActiveState(skilldexState);
			break;
		case "openCharacterScreen":
			main_openActiveState(characterScreenState);
			break;
		case "closeCharacterScreen":
			main_closeActiveState(characterScreenState);
			break;
		case "openPipBoy":
			main_openActiveState(pipboyState);
			break;
		case "closePipBoy":
			main_closeActiveState(pipboyState);
			break;
		case "openMap":
			main_openActiveState(mapScreenState);
			break;
		case "closeMap":
			main_closeActiveState(mapScreenState);
			break;
		default:
			console.log('main_gameStateFunction: improper arguments supplied');
			break;
	}
};


function main_payloadError(error) {
	console.log(error);
};

function main_loadJsonPayload(url) {
	return new Promise(
		function(resolve, reject) {
			let payloadXHR = new XMLHttpRequest();

			payloadXHR.onload = function() {
				resolve(this.response);
			};

			payloadXHR.onerror = function() {
				reject(this.statusText);
			};

			payloadXHR.open("GET", url, true);
			payloadXHR.responseType = 'json';
			payloadXHR.send();
		}
	);
};
