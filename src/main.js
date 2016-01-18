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



var _screenBuffer = new Uint8Array(_screenWidth * _screenHeight).fill(0);
var PAL;

var PALGL;
var IMTEX;
var gl;
var gl_positions;


function main_init_pal() {
	return new Uint8Array([255,255,255,255,236,236,236,255,220,220,220,255,204,204,204,255,188,188,188,255,176,176,176,255,160,160,160,255,144,144,144,255,128,128,128,255,116,116,116,255,100,100,100,255,84,84,84,255,72,72,72,255,56,56,56,255,40,40,40,255,32,32,32,255,252,236,236,255,236,216,216,255,220,196,196,255,208,176,176,255,192,160,160,255,176,144,144,255,164,128,128,255,148,112,112,255,132,96,96,255,120,84,84,255,104,68,68,255,88,56,56,255,76,44,44,255,60,36,36,255,44,24,24,255,32,16,16,255,236,236,252,255,216,216,236,255,196,196,220,255,176,176,208,255,160,160,192,255,144,144,176,255,128,128,164,255,112,112,148,255,96,96,132,255,84,84,120,255,68,68,104,255,56,56,88,255,44,44,76,255,36,36,60,255,24,24,44,255,16,16,32,255,252,176,240,255,196,96,168,255,104,36,96,255,76,20,72,255,56,12,52,255,40,16,36,255,36,4,36,255,28,12,24,255,252,252,200,255,252,252,124,255,228,216,12,255,204,184,28,255,184,156,40,255,164,136,48,255,144,120,36,255,124,104,24,255,108,88,16,255,88,72,8,255,72,56,4,255,52,40,0,255,32,24,0,255,216,252,156,255,180,216,132,255,152,184,112,255,120,152,92,255,92,120,72,255,64,88,52,255,40,56,32,255,112,96,80,255,84,72,52,255,56,48,32,255,104,120,80,255,112,120,32,255,112,104,40,255,96,96,36,255,76,68,36,255,56,48,32,255,156,172,156,255,120,148,120,255,88,124,88,255,64,104,64,255,56,88,88,255,48,76,72,255,40,68,60,255,32,60,44,255,28,48,36,255,20,40,24,255,16,32,16,255,24,48,24,255,16,36,12,255,8,28,4,255,4,20,0,255,4,12,0,255,140,156,156,255,120,148,152,255,100,136,148,255,80,124,144,255,64,108,140,255,48,88,140,255,44,76,124,255,40,68,108,255,32,56,92,255,28,48,76,255,24,40,64,255,156,164,164,255,56,72,104,255,80,88,88,255,88,104,132,255,56,64,80,255,188,188,188,255,172,164,152,255,160,144,124,255,148,124,96,255,136,104,76,255,124,88,52,255,112,72,36,255,100,60,20,255,88,48,8,255,252,204,204,255,252,176,176,255,252,152,152,255,252,124,124,255,252,100,100,255,252,72,72,255,252,48,48,255,252,0,0,255,224,0,0,255,196,0,0,255,168,0,0,255,144,0,0,255,116,0,0,255,88,0,0,255,64,0,0,255,252,224,200,255,252,196,148,255,252,184,120,255,252,172,96,255,252,156,72,255,252,148,44,255,252,136,20,255,252,124,0,255,220,108,0,255,192,96,0,255,164,80,0,255,132,68,0,255,104,52,0,255,76,36,0,255,48,24,0,255,248,212,164,255,216,176,120,255,200,160,100,255,188,144,84,255,172,128,68,255,156,116,52,255,140,100,40,255,124,88,28,255,112,76,20,255,96,64,8,255,80,52,4,255,64,40,0,255,52,32,0,255,252,228,184,255,232,200,152,255,212,172,124,255,196,144,100,255,176,116,76,255,160,92,56,255,144,76,44,255,132,60,32,255,120,44,24,255,108,32,16,255,92,20,8,255,72,12,4,255,60,4,0,255,252,232,220,255,248,212,188,255,244,192,160,255,240,176,132,255,240,160,108,255,240,148,92,255,216,128,84,255,192,112,72,255,168,96,64,255,144,80,56,255,120,64,48,255,96,48,36,255,72,36,28,255,56,24,20,255,100,228,100,255,20,152,20,255,0,164,0,255,80,80,72,255,0,108,0,255,140,140,132,255,28,28,28,255,104,80,56,255,48,40,32,255,140,112,96,255,72,56,40,255,12,12,12,255,60,60,60,255,108,116,108,255,120,132,120,255,136,148,136,255,148,164,148,255,88,104,96,255,96,112,104,255,60,248,0,255,56,212,8,255,52,180,16,255,48,148,20,255,40,116,24,255,252,252,252,255,240,236,208,255,208,184,136,255,152,124,80,255,104,88,60,255,80,64,36,255,52,40,28,255,24,16,12,255,0,0,0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255]);
	
};


function main_init_gl() {
	console.log("init gl");
	
	gl = getWebGLContext(_canvas);
	if(!gl) {
		console.log("no WebGL");
		return false;
	}
	
	gl.clearColor(0,0,0,1);

	// Note: createProgramFromScripts will call bindAttribLocation
	// based on the index of the attibute names we pass to it.
	var program = createProgramFromScripts(
		gl, 
		["vshader", "fshader"], 
		["a_position", "a_textureIndex"]);
		
	gl.useProgram(program);
	var imageLoc = gl.getUniformLocation(program, "u_image");
	var paletteLoc = gl.getUniformLocation(program, "u_palette");
	
	gl.uniform1i(imageLoc, 0);		// tell it to use texture units 0 and 1 for the image and palette
	gl.uniform1i(paletteLoc, 1);

	
	gl_positions = [		// Setup a unit quad
		  1,  1,  
		 -1,  1,  
		 -1, -1,  
		  1,  1,  
		 -1, -1,
		  1, -1,  
	];
	
	var vertBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gl_positions), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

	
	var PAL = main_init_pal();
	
	gl.activeTexture(gl.TEXTURE1);		// make palette texture and upload palette
	PALGL = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, PALGL);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, PAL);
		
	gl.activeTexture(gl.TEXTURE0);		// make image textures and upload image
	IMTEX = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, IMTEX);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, _screenWidth, _screenHeight, 0, gl.ALPHA, gl.UNSIGNED_BYTE, _screenBuffer);
	
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



