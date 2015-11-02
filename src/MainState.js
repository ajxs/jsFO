"use strict";

function MainState() {
	GameState.call(this);

	// instantiate all static assets here
	this.map = new GameMap();

	this.objectBuffer = document.createElement("canvas");
	this.objectBufferContext = this.objectBuffer.getContext("2d");

	this.objectBuffer.width = this.objectBufferRect.width;
	this.objectBuffer.height = this.objectBufferRect.height;

	this.objectBuffer2 = document.createElement("canvas");
	this.objectBufferContext2 = this.objectBuffer2.getContext("2d");

	this.objectBuffer2.width = this.objectBufferRect.width;
	this.objectBuffer2.height = this.objectBufferRect.height;

	this.eggBuffer = document.createElement("canvas");
	//this.eggBuffer.width = this.eggBufferRect.width;
	//this.eggBuffer.height = this.eggBufferRect.height;
	
	this.eggBuffer.width = 300;		// @TODO: FIX - this is a crude fix placed in to fix an issue with Chrome v46+ - see https://code.google.com/p/chromium/issues/detail?id=543342
	this.eggBuffer.height = 300;
	
	this.eggContext = this.eggBuffer.getContext("2d");
	this.transEgg = document.getElementById("trans_egg");

	this.brightmap = document.createElement("canvas");
	this.brightmap.width = _screenWidth;
	this.brightmap.height = _screenHeight;
	this.brightmapContext = this.brightmap.getContext("2d");

	this.mse_overlay = document.getElementById("mse_overlay");		// WHY FALLOUT WHY
	this.mse_overlay_blocked = document.getElementById("mse_overlay_blocked");


};

MainState.prototype = new GameState();
MainState.prototype.constructor = MainState;

MainState.prototype.map = 0;


MainState.prototype.currentRenderObject = 0;
MainState.prototype.currentRenderImg = 0;

MainState.prototype.scrollDelta = 5;	// scroll handler
MainState.prototype.scrollCheckIndex = 0;

MainState.prototype.scrollCheckAdj = 0;


MainState.prototype.objectBuffer = 0;
MainState.prototype.objectBuffer2 = 0;
MainState.prototype.objectBufferContext = 0;
MainState.prototype.objectBufferContext2 = 0;
MainState.prototype.objectBufferData = 0;

MainState.prototype.objectBufferRect = {
	x: 0,
	y: 0,
	width: 100,
	height: 100,

};


MainState.prototype.hIndex = 0;
MainState.prototype.hsIndex = 0;

MainState.prototype.mse_overlay = 0;
MainState.prototype.mse_overlay_blocked = 0;

MainState.prototype.mapObjects = 0;

MainState.prototype.player = 0;

MainState.prototype.inputRunState = false;

MainState.prototype.scrollStates = {
	xPos: false, xNeg: false,
	yPos: false, yNeg: false,

	xPosBlocked: false, xNegBlocked: false,
	yPosBlocked: false, yNegBlocked: false,

};

MainState.prototype.objectIndex = 0;

MainState.prototype.inputState = "game";
MainState.prototype.inputState_sub = "move";


MainState.prototype.brightmap = 0;
MainState.prototype.brightmapContext = 0;

MainState.prototype.roofRenderState = 0;

MainState.prototype.camera = {
	x:0, y: 0,

	trackToCoords: function(_c) {	// track camera to coordinates.
		this.x = _c.x - (_screenWidth*0.5)|0;
		this.y = _c.y - (_screenHeight*0.5)|0;
	},
};



MainState.prototype.path_closedSet = 0;		// findPath vars
MainState.prototype.path_frontier = 0;
MainState.prototype.path_cameFrom = 0;
MainState.prototype.path_g_score = 0;
MainState.prototype.path_f_score = 0;
MainState.prototype.path_tg_score = 0;
MainState.prototype.path_path = 0;

MainState.prototype.path_current = 0;
MainState.prototype.path_next = 0;
MainState.prototype.path_adjList = 0;


MainState.prototype.mapLightLevel = 1;
MainState.prototype.scrollimg = 0;

MainState.prototype.transEgg = 0;
MainState.prototype.eggBuffer = 0;
MainState.prototype.eggContext = 0;
MainState.prototype.eggBufferRect = {
	x: 0, y: 0,
	width: 129,
	height: 98,
};


MainState.prototype.interfaceRect = {
	x: 0,		// set in main_setResolution
	y: 0,
	width: 640,
	height: 99,
	activeItem: -1,
	mouseState: 0,
	
	skilldexButton: {
		x: 523,
		y: 6,
		width: 22,
		height: 21,
	},
	
	invButton: {
		x: 211,
		y: 40,
		width: 32,
		height: 21,		
	},

	mapButton: {
		x: 526,
		y: 39,
		width: 41,
		height: 19,		
	},
	
	charButton: {
		x: 526,
		y: 58,
		width: 41,
		height: 19,		
	},
	
	pipButton: {
		x: 526,
		y: 77,
		width: 41,
		height: 19,		
	},
	
	menuButton: {
		x: 210,
		y: 61,
		width: 34,
		height: 34,		
	},	

	
};


MainState.prototype.console = {
	consoleData: [],
	x: -1, y: -1,		// set in main_setResolution()

	fontHeight: 10,
	fontColor: "#00FF00",

	print: function() {	// accepts n arguments, pushes all to console
		for(var i = 0; i < arguments.length; i++) {
			var string = "\x95" + arguments[i];
			var split = string.match(/.{1,22}/g);	// split string to line width
			for(var k = 0; k < split.length; k++) this.consoleData.unshift(split[k]);
		}
	},

	clear: function() {
		this.consoleData = [];
	}
};

MainState.prototype.mapGeometry = {	// struct for map geometry vars/functions

	/* note: Hex and Tile sizes are hardcoded as:
	hex - w: 32, h: 16
	tile - w: 80: h: 32 */

	m_width: 100,	// nTiles in row
	h_width: 200,

	m_roofHeight: 96,

	m_transform: {	// offsets to make hexes and maptiles align
		x: 48, y: -3,
	},
	

	h2s: function(i) {	// hex index to screen-space
		var q = (i%this.h_width)|0;
		var r = (i/this.h_width)|0;

		var px = 0 - q*32 + r*16, py = r*12;

		var qx = ((q/2)|0)*16;
		var qy = ((q/2)|0)*12;

		return {
			x: px + qx,
			y: py + qy,
		}
	},

	c2s: function(i) {	// maptile index to screen-space
		var tCol = i%this.m_width, tRow = (i/this.m_width)|0;
		return {
			x: 0 - this.m_transform.x - (tCol*48) + (tRow*32),		// map origin { x: 0, y: 0} is at upper right.
			y: this.m_transform.y + tCol*12 + (tRow*24),
		}
	},

	s2h: function(mx,my) {	// screen-space to hex index conversion
		if(mx < 0) mx -= 32;    // compensate for -0 effect
		mx *= -1;
		
		var hCol = (mx/32)|0, hRow = (my/12)|0;
		if(hRow >0) hCol += Math.abs(hRow/2)|0;
		hRow -= (hCol/2)|0;

		return ((hRow*this.h_width)+hCol);

	},

	findAdj: function(i) {	// returns array of indexes of hexes adjacent to index		
		return new Array(
			(i%2) ? i - (this.h_width+1) : i-1,
			(i%2) ? i-1 : i + (this.h_width-1),
			i+this.h_width,
			(i%2) ? i+1 : i + (this.h_width+1),
			(i%2) ? i-(this.h_width-1) : i+1,
			i-this.h_width);
	},

	findOrientation: function(_origin, _dest) {		// finds orientation between two adjacent hexes
		if(_origin == _dest) {
			console.log("MainState: findOrientation error: origin and dest identical");
			return 0;
		}
		var orientation = this.findAdj(_origin).indexOf(_dest);
		if(orientation == -1) {
			console.log("MainState: findOrientation error: -1");
			return 0;
		}
		return orientation;
	},

	hDistance: function(_a,_b) {	// pythagorean distance
		var ha = this.h2s(_a);
		var hb = this.h2s(_b);

		var dx = Math.abs(hb.x - ha.x);
		var dy = Math.abs(hb.y - ha.y);
		return Math.sqrt((dx*dx)+(dy*dy));

	},

};


MainState.prototype.init = function(_saveState) {		// use arguments here to pass saved state data.
	console.log("MainState: init: " + _saveState.map);
	
	var loadMap = "maps/" + _saveState.map;
	this.map.defaultElevation = _assets[loadMap].defaultElevation;		// copy map vars
	this.map.elevationAt0 = _assets[loadMap].elevationAt0;
	this.map.elevationAt1 = _assets[loadMap].elevationAt1;
	this.map.elevationAt2 = _assets[loadMap].elevationAt2;
	this.map.nElevations = _assets[loadMap].nElevations;

	this.map.globalVars = _assets[loadMap].globalVars;
	this.map.localVars = _assets[loadMap].localVars;

	this.map.playerStartDir = _assets[loadMap].playerStartDir;
	this.map.playerStartPos = _assets[loadMap].playerStartPos;

	this.map.tileInfo = _assets[loadMap].tileInfo;

	console.log("MainState: init: initializing hexGrid");
	this.map.hexMap = new Array(this.map.nElevations);		// init/reset hexmap
	this.mapObjects = new Array(this.map.nElevations);		// create / instantiate mapObjects

	console.log("MainState: init: loading mapObjects");
	
	for(var n = 0; n < this.map.nElevations; n++) {

		this.map.hexMap[n] = new Array(40000);
		for(var h = 0; h < 40000; h++) {
			this.map.hexMap[n][h] = {
				blocked: false,
				disabled: false,
				scrollBlock: false,
			};
		}
	
		var objectInfoLength = _assets[loadMap].objectInfo[n].length;
		this.mapObjects[n] = new Array(objectInfoLength);

		for(var i = 0; i < objectInfoLength; i++) {

			this.mapObjects[n][i] = this.createMapObject(_assets[loadMap].objectInfo[n][i]);

			if(!(this.mapObjects[n][i].itemFlags & 0x00000010)) this.map.hexMap[n][this.mapObjects[n][i].hexPosition].blocked = true;	// check if flags for 'can be walked through' are false.
			
			switch(this.getObjectType(this.mapObjects[n][i].frmTypeID)) {
				case "walls":
					break;
				case "misc":

					switch(this.mapObjects[n][i].objectID) {		// this needs massive fixing, need to figure out what value this is meant to be
						case 12:		// scrollblockers
							this.map.hexMap[n][this.mapObjects[n][i].hexPosition].scrollBlock = true;
							break;
					
						case 16:	// exit grids
						case 17:
						case 18:
						case 19:
						case 20:
						case 21:
						case 22:
						case 23:
							this.map.hexMap[n][this.mapObjects[n][i].hexPosition].exitGrid = true;
							
							this.map.hexMap[n][this.mapObjects[n][i].hexPosition].exitGrid_map = this.mapObjects[n][i].exitGrid_map;
							this.map.hexMap[n][this.mapObjects[n][i].hexPosition].exitGrid_pos = this.mapObjects[n][i].exitGrid_pos;
							this.map.hexMap[n][this.mapObjects[n][i].hexPosition].exitGrid_elev = this.mapObjects[n][i].exitGrid_elev;
							this.map.hexMap[n][this.mapObjects[n][i].hexPosition].exitGrid_orientation = this.mapObjects[n][i].exitGrid_orientation;
							
							break;						
					}
					
					break;
			};
		}
	}

	console.log("MainState: init: creating player");

	this.player = _saveState.player;

	if(_saveState.playerStartPos == "default") this.player.hexPosition = this.map.playerStartPos;
	else this.player.hexPosition = _saveState.playerStartPos;

	if(_saveState.playerStartOrientation == "default") this.player.orientation = this.map.playerStartDir;
	else this.player.orientation = _saveState.playerStartOrientation;

	if(_saveState.playerStartElevation == "default") this.player.currentElevation = this.map.defaultElevation;
	else this.player.currentElevation = _saveState.playerStartElevation;

	this.object_setAnim(this.player,"idle");

	this.mapObjects[this.player.currentElevation].push(this.player);

	console.log("MainState: init: loading finished");

	this.camera.trackToCoords(this.mapGeometry.h2s(this.player.hexPosition));

	return true;

};

MainState.prototype.createSaveState = function(_map,_pos,_elev,_orientation) {	// creates a gamestate for MainState to load to facilitate switching maps.
	var saveState = {}
	
	if(!_pos) _pos == "default";		// fix this to track '0'
	if(!_orientation) _orientation == "default";
	if(!_elev) _elev == "default";
	
	saveState.map = _assets["data/maps.txt"][_map].mapName + ".map";
	
	saveState.playerStartPos = _pos,
	saveState.playerStartOrientation = _orientation,
	saveState.playerStartElevation = _elev,
	
	saveState.player = this.player;		// save player
	return saveState;
};


MainState.prototype.exitMap = function(_map,_pos,_elev,_orientation) {
	this.actor_endMoveState(this.player);	// reset movement vars so player doesn't get stuck in an unfinishable moveState when switching maps
	main_loadGame(this.createSaveState(_map,_pos,_elev,_orientation))	//function(_map,_pos,_elev,_orientation)
};


MainState.prototype.getObjectType = function(_id) {		// returns type from typeID
	switch(_id) {
		case 0:
			return "items";
		case 1:
			return "critters";
		case 2:
			return "scenery";
		case 3:
			return "walls";
		case 4:
			return "tiles";
		case 5:
			return "misc";
		default:
			console.log("MainState: getObjectType: Can't read objectTypeID: " + _id);
			return false;
	}
};


MainState.prototype.generateFRMstring = function(object) {	// generates FRM string from mapObject object.

	var frmID = object.FID & 0x00000FFF;
	var filetype = this.getObjectType(object.FID >> 24);

	if(filetype == "critters") {
		var weaponString = "a";
		var animString = "a";

		var frmBase = _assets["art/critters/critters.lst"][frmID].data.base;

		if(object.armorMaleFID || object.armorFemaleFID) {
			frmBase = FIDtoFRM(object.armorMaleFID);
		}

		if(object.slot2) {	// ?
			switch(object.slot2.weaponAnimCode) {
				case 1: // knife
					weaponString = "d";
					break;
				case 2: // club
					weaponString = "e";
					break;
				case 3: // hammer
					weaponString = "f";
					break;
				case 4: // spear
					weaponString = "g";
					break;
				case 5: // pistol
					weaponString = "h";
					break;
				case 6: // smg
					weaponString = "i";
					break;
				case 7: // rifle
					weaponString = "j";
					break;
				case 8: // big gun
					weaponString = "k";
					break;
				case 9: // minigun
					weaponString = "l";
					break;
				case 10: // rocket launcher
					weaponString = "m";
					break;
			}
		}

		switch(object.anim.currentAnim) {
			case "idle":
				return "art/critters/" + frmBase + weaponString + "a.frm";
			case "walk":
				return "art/critters/" + frmBase + weaponString + "b.frm";
			case "run":
				return "art/critters/" + frmBase + "at.frm";
			case "use":
				return "art/critters/" + frmBase + "al.frm";
			default:
				return "art/critters/" + frmBase + "aa.frm";

		}
	}

	var filename = _assets["art/" + filetype + "/" + filetype + ".lst"][frmID].data;
	return "art/" + filetype + "/" + filename;

};

MainState.prototype.generateFRMptr = function(object) {
	return _assets[this.generateFRMstring(object)];
};


MainState.prototype.findPath = function(start,dest) {
	if(start == dest) return 0;

	this.path_closedSet = [];
	this.path_frontier = [];
	this.path_cameFrom = [];
	this.path_g_score = [];
	this.path_f_score = [];

	this.path_g_score[start] = 0;
	this.path_f_score[start] = this.mapGeometry.hDistance(start,dest);

	this.path_frontier.push(start);

	while(this.path_frontier.length) {
		this.path_current = this.path_frontier[0];

		for(var k = 0; k < this.path_frontier.length; k++) {	// get lowest f_score - O(1)
			if(this.path_f_score[this.path_frontier[k]] < this.path_f_score[this.path_current]) this.path_current = this.path_frontier[k];
		}

		if(this.path_current == dest) {	// if dest reached
			this.path_path = [];

			this.path_path.unshift(dest);		// iterate backwards through solution, add to path array
			this.path_current = this.path_cameFrom[dest];

			while(this.path_current != start) {
				this.path_path.unshift(this.path_current);
				this.path_current = this.path_cameFrom[this.path_current];
			}
			return this.path_path;
		}

		this.path_adjList = this.mapGeometry.findAdj(this.path_current);
		this.path_closedSet.push(this.path_frontier.shift());

		for(var i = 0; i < 6; i++) {
			this.path_next = this.path_adjList[i];

			if(this.path_next < 0 || this.path_next > 40000) continue;	// if out of bounds
			if(this.path_closedSet.indexOf(this.path_next) != -1) continue;	// if in closedList
			if(this.map.hexMap[this.player.currentElevation][this.path_next].blocked) {	// if blocked
				this.path_closedSet.push(this.path_next);
				continue;
			}

			this.path_tg_score = this.path_g_score[this.path_current] + this.mapGeometry.hDistance(this.path_current,this.path_next);

			if(this.path_frontier.indexOf(this.path_next) == -1 || this.path_tg_score < this.path_g_score[this.path_next]) {
				this.path_cameFrom[this.path_next] = this.path_current;
				this.path_g_score[this.path_next] = this.path_tg_score;
				this.path_f_score[this.path_next] = this.path_g_score[this.path_next] + this.mapGeometry.hDistance(this.path_next,dest);
				if(this.path_frontier.indexOf(this.path_next) == -1) this.path_frontier.push(this.path_next);
			}
		}
	}

	return 0;

};



MainState.prototype.input = function(e) {
	switch(e.type) {
		case "mousemove":
			break;
		case "keydown":
			if(_keyboardStates[27]) {
				main_ingameMenu();
				return;
			}

			break;
		case "keyup":
			break;
		case "mousedown":
			if(this.inputState == "interface") {
				this.interfaceRect.mouseState = 1;
				return;
			} else if(this.inputState == "game") {
				if(this.inputState_sub == "command") {
					if(_mouse.c2) return;		// stop mouse2 from triggering commands when in command mode
					this.objectIndex = this.getObjectIndex();
					if(this.objectIndex != -1) {		// if object under cursor
						var objC = this.mapGeometry.h2s(this.mapObjects[this.player.currentElevation][this.objectIndex].hexPosition);
						main_openContextMenu(this.objectIndex,
							objC.x - this.camera.x + 30,
							objC.y - this.camera.y - 20);						
					}

				}
			}
			break;
		case "mouseup":
			if(this.inputState == "interface") {
				this.interfaceRect.mouseState = 0;
			}
			break;
		case "click":
			if(this.inputState == "interface") {
				switch(this.interfaceRect.activeItem) {
					case -1: 
						break;
					case "skilldexButton":
						main_openSkilldex();
						this.interfaceRect.activeItem = -1;
						break;
					case "invButton":
						main_openInventory();
						this.interfaceRect.activeItem = -1;
						break;
					case "charButton":
						main_openCharacterScreen();
						this.interfaceRect.activeItem = -1;
						break;
					case "pipButton":
						main_openPipboy();
						this.interfaceRect.activeItem = -1;
						break;
					case "mapButton":
						main_openMap();
						this.interfaceRect.activeItem = -1;
						break;
					case "menuButton":
						main_ingameMenu();
						this.interfaceRect.activeItem = -1;
						break;
				}
			} else if(this.inputState == "game") {
				if(this.inputState_sub == "move") {
					//this.actor_cancelAction(this.player);
					this.actor_beginMoveState(this.player,this.hIndex,this.inputRunState);
				}
			}
			break;
		case 'contextmenu':	// switch input modes on mouse2
			if(this.inputState == "game") {
				if(this.inputState_sub == "move") this.inputState_sub = "command";
				else if(this.inputState_sub == "command") this.inputState_sub = "move";
			}
			break;
	};

};

MainState.prototype.contextMenuAction = function(action,target) {
	if(target == -1) return;
	
	switch(action) {			
		case "hoverlook":
		case "look":
		
			var textIndex, msgFile;			
			if(action == "hoverlook") textIndex = this.mapObjects[this.player.currentElevation][target].textID;
			else if(action == "look") textIndex = this.mapObjects[this.player.currentElevation][target].textID+1;

			switch( this.getObjectType(this.mapObjects[this.player.currentElevation][target].objectTypeID) ) {
				case "items":
					msgFile = _assets["text/english/game/pro_item.msg"];
					break;
				case "critters":
					msgFile = _assets["text/english/game/pro_crit.msg"];
					break;
				case "scenery":
					msgFile = _assets["text/english/game/pro_scen.msg"];
					break;
				case "walls":
					msgFile = _assets["text/english/game/pro_wall.msg"];
					break;
				case "tiles":
					msgFile = _assets["text/english/game/pro_tile.msg"];
					break;
				case "misc":
					msgFile = _assets["text/english/game/pro_misc.msg"];
					break;
				default:
					return false;
			}

			if(msgFile.data[textIndex]) {
				this.console.print(_assets["text/english/game/proto.msg"].data[490].text.replace("%s",msgFile.data[textIndex].text));		// "You see: %s."
			} else {
				this.console.print(_assets["text/english/game/proto.msg"].data[493].text);		// "You see nothing out of the ordinary."
			}
		
			break;
			

		case "use":
	
			var mState = this;
			var useDest = -1;		// find adj hexes
			var useFunction = 0;
			var targetItem = mState.mapObjects[mState.player.currentElevation][target];
			
			console.log(targetItem);
			
			var useAdj = this.mapGeometry.findAdj(targetItem.hexPosition);
			
			useDest = useAdj.indexOf(this.player.hexPosition);	// check if player next to item
			for(var a = 0; a < 6; a++) {
				if(this.findPath(this.player.hexPosition,useAdj[a])) {
					useDest = useAdj[a];
					break;
				}
			}				
			
			switch(targetItem.objectType) {
				case "door":
					useFunction = function() {
						//console.log("useFunction: " + targetItem.hexPosition + " / " + mainState.player.hexPosition);
						mState.player.orientation = mState.mapGeometry.findOrientation(mState.player.hexPosition, targetItem.hexPosition);
						mState.object_playAnim(mState.player,"use",0,0,0,false,0,function() {
							if(targetItem.openState == 0) mState.object_openDoor(targetItem);
							else mState.object_closeDoor(targetItem);
						});
					};
					break;
			}
			
			if(useFunction) {
				if(useDest == this.player.hexPosition) useFunction();
				else if(useDest != -1) {		// fix this to be correctly aligned
					this.actor_addAction(this.player,useFunction,"endMoveState");
					this.actor_beginMoveState(this.player, useDest, this.inputRunState);
					
				}
			} else {
				console.log("no useFunction definiton");
			}

			break;

		case "cancel":
			break;

	}
};


MainState.prototype.getObjectIndex = function() {
	// this function stencils screen objects onto an offscreen buffer, with a solid color based upon that object's position in the mapObjects array.
	// from this function you can accurately find the object under the cursor by blitting the objects 50px around the cursor onto the buffer, then reading the color underneath the centre of the image.
	// from the formula r*1000 + b*100 + g we can find the index of the object.
	
	this.objectBuffer.width = this.objectBufferRect.width;	// hack clear
	this.objectBufferRect.x = _mouse.x - this.objectBufferRect.width/2;
	this.objectBufferRect.y = _mouse.y - this.objectBufferRect.height/2;

	var mapObjectsLength = this.mapObjects[this.player.currentElevation].length;
	for(var i = 0; i < mapObjectsLength; i++) {
		this.currentRenderObject = this.mapObjects[this.player.currentElevation][i];
		
		var c = this.mapGeometry.h2s(this.currentRenderObject.hexPosition);
		this.currentRenderImg = this.currentRenderObject.anim.img.frameInfo[this.currentRenderObject.orientation][this.currentRenderObject.anim.frameNumber];

		var destX = (c.x + 16 - ((this.currentRenderImg.width/2)|0)) + this.currentRenderObject.anim.shiftX - this.camera.x;	// object coords.
		var destY = (c.y + 8 - this.currentRenderImg.height) + this.currentRenderObject.anim.shiftY- this.camera.y;

		if(!intersectTest(destX, destY,
			this.currentRenderImg.width,
			this.currentRenderImg.height,
			this.objectBufferRect.x,
			this.objectBufferRect.y,
			this.objectBufferRect.width,
			this.objectBufferRect.height)) continue;


		var cCol = this.currentRenderObject.hexPosition % 100;
		var pCol = this.player.hexPosition % 100;

		var cRow = (this.currentRenderObject.hexPosition / 100)|0;
		var pRow = (this.player.hexPosition / 100)|0;			

		if(this.getObjectType(this.currentRenderObject.frmTypeID) == "walls") {	// don't blit walls 'infront' of player.
			if(!(cRow < pRow || cCol < pCol  )) continue;
		}
		
		this.objectBufferContext2.globalCompositeOperation = "source-over";
		this.objectBuffer2.width = this.objectBufferRect.width;	// hack clear

		this.objectBufferContext2.drawImage(this.currentRenderImg.img,
			0, 0);			
			
		this.objectBufferContext2.globalCompositeOperation = "source-in";
		this.objectBufferContext2.fillStyle = "rgb("+ Math.floor(i/1000) +","+ Math.floor((i%1000)/100) +","+ i%100 +")";
		this.objectBufferContext2.fillRect(0,0,
			this.currentRenderImg.width,
			this.currentRenderImg.height);

		this.objectBufferContext.drawImage(this.objectBuffer2,
			destX - this.objectBufferRect.x,
			destY - this.objectBufferRect.y);

	}

	this.objectBufferData = this.objectBufferContext.getImageData(50, 50, 1, 1).data;
	
	if(this.objectBufferData[3] == 0) return -1;	// if alpha for pixel == 0, no object under cursor.
	return this.objectBufferData[0]*1000 + this.objectBufferData[1]*100 + this.objectBufferData[2];

};

MainState.prototype.cIndex_time;
MainState.prototype.cIndex_test;
MainState.prototype.cIndex_state = false;
MainState.prototype.cIndex_path = -1;

MainState.prototype.cIndex_x;
MainState.prototype.cIndex_y;



MainState.prototype.update = function() {

	// STATE HANDLING
	this.scrollStates.yNeg = (_mouse.y < (_screenHeight * 0.025));
	this.scrollStates.yPos = (_mouse.y > (_screenHeight * 0.975));
	this.scrollStates.xNeg = (_mouse.x < (_screenWidth * 0.05));
	this.scrollStates.xPos = (_mouse.x > (_screenWidth * 0.95));
	this.scrollState = (this.scrollStates.yNeg || this.scrollStates.yPos || this.scrollStates.xNeg || this.scrollStates.xPos);

	if(intersectTest(_mouse.x,_mouse.y,0,0, 0,0,_screenWidth,_screenHeight) && this.scrollState) {
		this.inputState = "scroll";
		
		this.scrollCheckAdj = this.mapGeometry.findAdj(this.mapGeometry.s2h( 320 + this.camera.x, 190 + this.camera.y));
		
		this.scrollStates.xPosBlocked = (this.map.hexMap[this.player.currentElevation][this.scrollCheckAdj[1]].scrollBlock);	// check if these hexes have the scrollBlock attribute.
		this.scrollStates.yNegBlocked = (this.map.hexMap[this.player.currentElevation][this.scrollCheckAdj[0]].scrollBlock && this.map.hexMap[this.player.currentElevation][this.scrollCheckAdj[5]].scrollBlock);
		this.scrollStates.yNegBlocked = (this.map.hexMap[this.player.currentElevation][this.scrollCheckAdj[0]].scrollBlock && this.map.hexMap[this.player.currentElevation][this.scrollCheckAdj[5]].scrollBlock);
		this.scrollStates.yPosBlocked = (this.map.hexMap[this.player.currentElevation][this.scrollCheckAdj[2]].scrollBlock && this.map.hexMap[this.player.currentElevation][this.scrollCheckAdj[3]].scrollBlock);	
		this.scrollStates.xNegBlocked = (this.map.hexMap[this.player.currentElevation][this.scrollCheckAdj[4]].scrollBlock);

		if(this.scrollStates.yNeg && !this.scrollStates.yNegBlocked) this.camera.y -= this.scrollDelta;	// scrolling handling
		if(this.scrollStates.yPos && !this.scrollStates.yPosBlocked) this.camera.y += this.scrollDelta;
		if(this.scrollStates.xNeg && !this.scrollStates.xNegBlocked) this.camera.x -= this.scrollDelta;
		if(this.scrollStates.xPos && !this.scrollStates.xPosBlocked) this.camera.x += this.scrollDelta;
	
	} else if(intersectTest(_mouse.x,_mouse.y,0,0, this.interfaceRect.x,this.interfaceRect.y,this.interfaceRect.width,this.interfaceRect.height)) {	// if mouse over interface rect
		this.inputState = "interface";
		this.interfaceRect.activeItem = -1;
		// check interface items here
		if(intersectTest(_mouse.x,_mouse.y,0,0,
			this.interfaceRect.x + this.interfaceRect.skilldexButton.x, this.interfaceRect.y + this.interfaceRect.skilldexButton.y,
			this.interfaceRect.skilldexButton.width, this.interfaceRect.skilldexButton.height)) {
				this.interfaceRect.activeItem = "skilldexButton";
		}
		if(intersectTest(_mouse.x,_mouse.y,0,0,
			this.interfaceRect.x + this.interfaceRect.invButton.x, this.interfaceRect.y + this.interfaceRect.invButton.y,
			this.interfaceRect.invButton.width, this.interfaceRect.invButton.height)) {
				this.interfaceRect.activeItem = "invButton";
		}
		if(intersectTest(_mouse.x,_mouse.y,0,0,
			this.interfaceRect.x + this.interfaceRect.charButton.x, this.interfaceRect.y + this.interfaceRect.charButton.y,
			this.interfaceRect.charButton.width, this.interfaceRect.charButton.height)) {
				this.interfaceRect.activeItem = "charButton";
		}
		if(intersectTest(_mouse.x,_mouse.y,0,0,
			this.interfaceRect.x + this.interfaceRect.pipButton.x, this.interfaceRect.y + this.interfaceRect.pipButton.y,
			this.interfaceRect.pipButton.width, this.interfaceRect.pipButton.height)) {
				this.interfaceRect.activeItem = "pipButton";
		}
		if(intersectTest(_mouse.x,_mouse.y,0,0,
			this.interfaceRect.x + this.interfaceRect.mapButton.x, this.interfaceRect.y + this.interfaceRect.mapButton.y,
			this.interfaceRect.mapButton.width, this.interfaceRect.mapButton.height)) {
				this.interfaceRect.activeItem = "mapButton";
		}
		if(intersectTest(_mouse.x,_mouse.y,0,0,
			this.interfaceRect.x + this.interfaceRect.menuButton.x, this.interfaceRect.y + this.interfaceRect.menuButton.y,
			this.interfaceRect.menuButton.width, this.interfaceRect.menuButton.height)) {
				this.interfaceRect.activeItem = "menuButton";
		}				
	} else {
		this.inputState = "game";
		
		if(this.inputState_sub == "move") {
			this.hIndex = this.mapGeometry.s2h(_mouse.x + this.camera.x, _mouse.y + this.camera.y);		// hex index calculated here
			this.hsIndex = this.mapGeometry.h2s(this.hIndex);
			
			if(this.cIndex_test != this.hIndex) {		// check if mouse has moved for hover functionality
				this.cIndex_test = this.hIndex;
				this.cIndex_time = getTicks();
				this.cIndex_state = false;
				this.cIndex_path = -1;
			}
			
		} else if(this.inputState_sub == "command") {
			if(this.cIndex_x != _mouse.x || this.cIndex_y != _mouse.y) {	// check if mouse has moved for hover functionality
				this.cIndex_x = _mouse.x;
				this.cIndex_y = _mouse.y;
				this.cIndex_time = getTicks();
				this.cIndex_state = false;
			}
		}
		
		if(!this.cIndex_state && (Math.abs(getTicks() - this.cIndex_time) >= 1000)) {	// 'hover' functionality timer
		
			if(this.inputState_sub == "move") {
				this.cIndex_path = this.findPath(this.player.hexPosition, this.hIndex);
				this.cIndex_state = true;
				
			} else if(this.inputState_sub == "command") {
				this.objectIndex = this.getObjectIndex();
				this.contextMenuAction("hoverlook", this.objectIndex);
				this.cIndex_state = true;			
			}
		}
	
	}

	
	if(_keyboardStates[16]) {	// SHIFT control input for running
		this.inputRunState = true;
	} else this.inputRunState = false;


	var e = this.player.currentElevation;
	this.mapObjects[e].sort(function(a, b) {	// z-sort
		return ((a.hexPosition - b.hexPosition) || (a.anim.shiftY - b.anim.shiftY));
	});


	// animation
	var mapObjectsLength = this.mapObjects[e].length;
	
	for(var i=0; i < mapObjectsLength; i++) {	// tasks, framestep
		this.currentRenderObject = this.mapObjects[e][i];

		this.currentRenderImg = this.currentRenderObject.anim.img;

		if(this.currentRenderObject.anim.animActive) {	// framestep and animation functions
			this.currentRenderObject.anim.animDelta = (getTicks() - this.currentRenderObject.anim.lastFrameTime);
			if(this.currentRenderObject.anim.animDelta >= (1000/this.currentRenderImg.fps)) {	// if time to update frame.

				var cond = (this.currentRenderObject.anim.animDirection == 0) ? this.currentRenderObject.anim.frameNumber < this.currentRenderImg.nFrames-1 : this.currentRenderObject.anim.frameNumber > 0;
				if(cond) {	// frame increment
					if(this.currentRenderObject.anim.animDirection == 0) {
						this.currentRenderObject.anim.frameNumber++;
						this.currentRenderObject.anim.shiftX += this.currentRenderImg.frameInfo[this.currentRenderObject.orientation][this.currentRenderObject.anim.frameNumber].offsetX;
						this.currentRenderObject.anim.shiftY += this.currentRenderImg.frameInfo[this.currentRenderObject.orientation][this.currentRenderObject.anim.frameNumber].offsetY;
					} else {	// reverse
						this.currentRenderObject.anim.shiftX -= this.currentRenderImg.frameInfo[this.currentRenderObject.orientation][this.currentRenderObject.anim.frameNumber].offsetX;
						this.currentRenderObject.anim.shiftY -= this.currentRenderImg.frameInfo[this.currentRenderObject.orientation][this.currentRenderObject.anim.frameNumber].offsetY;
						this.currentRenderObject.anim.frameNumber--;
					}

					if(this.currentRenderObject.anim.frameNumber == this.currentRenderObject.anim.actionFrame) {	// if action frame						
						this.actor_nextAction(this.currentRenderObject,"onActionFrame");	
					}
				} else {	// if anim ended
					if(this.currentRenderObject.anim.animLoop) {
						if(this.currentRenderObject.anim.animDirection == 0) {
							this.object_setFrame(this.currentRenderObject,0)
						} else {	// reverse
							this.object_setFrame(this.currentRenderObject,-1)
						}

					} else {
						this.currentRenderObject.anim.animActive = false;
					}
					
					this.actor_nextAction(this.currentRenderObject,"onAnimEnd");

				}
				this.currentRenderObject.anim.lastFrameTime = getTicks();
			}
		} else {	// anim inactive
			if(this.currentRenderObject.hasOwnProperty('ai')) {		// idle twitch
				if(getTicks() - this.currentRenderObject.ai.idleStartTime > 2000) {
					if(Math.random() > 0.95) this.object_playAnim(this.currentRenderObject,"idle",0,0,0,false,0,function() {		//(obj, newAnim, frame, actionFrame, dir, loop, actionCallback, endCallback) {
						this.object_setAnim(this.currentRenderObject,"idle");		// reset to frame zero.
					});		
					this.currentRenderObject.ai.idleStartTime = getTicks();
				}
			}
		}
		
	}	// end mapobjects loop		

	 
	var playerCoords = this.mapGeometry.h2s(this.player.hexPosition);
	this.currentRenderImg = this.player.anim.img.frameInfo[this.player.orientation][this.player.anim.frameNumber];	
	
	var playerX = (playerCoords.x + 16 - ((this.currentRenderImg.width/2)|0)) + this.player.anim.shiftX - this.camera.x;	// actual coords of of objects.
	var playerY = (playerCoords.y + 8 - this.currentRenderImg.height) + this.player.anim.shiftY - this.camera.y;
	
	
	this.roofRenderState = true;		// check if player is under a roof
	for(var i = 0; i < 10000; i++) {
		if(this.map.tileInfo[this.player.currentElevation].roofTiles[i] < 2) continue;
		var c = this.mapGeometry.c2s(i);
		
		if(intersectTest(c.x - this.camera.x,		// @TODO : potentially use object buffer here.
			(c.y - 96) - this.camera.y,
			80, 36,
			playerX,
			playerY,		
			this.currentRenderImg.width,
			this.currentRenderImg.height)) {
				this.roofRenderState = false;
				break;
		}
	}

};


MainState.prototype.render = function() {
	this.eggContext.globalCompositeOperation = 'source-over';		// draw egg mask onto egg context.
	this.eggContext.drawImage(this.transEgg,0,0);

	var playerCoords = this.mapGeometry.h2s(this.player.hexPosition);
	var playerX = playerCoords.x + 16 + this.player.anim.shiftX - this.camera.x;
	var playerY = (playerCoords.y + 8) + this.player.anim.shiftY- this.camera.y;

	this.eggBufferRect.x = playerX - (this.eggBufferRect.width/2)|0;
	this.eggBufferRect.y = playerY - ((this.eggBufferRect.height/2)|0) - 35;	// @TODO: fix this
	
	var e = this.player.currentElevation;
	
	// render floor tiles.
	for(var i = 0; i < 10000; i++) {	
	
		//if(this.map.tileInfo[e].floorTiles[i] < 2) continue;
			
		var c = this.mapGeometry.c2s(i);
		if(!intersectTest(c.x, c.y,		// camera test
			80, 36,
			this.camera.x,
			this.camera.y,
			_screenWidth,
			_screenHeight)) continue;				

		_context.drawImage(_assets['art/tiles/tiles.lst'][this.map.tileInfo[e].floorTiles[i]].ptr.frameInfo[0][0].img,		// use pointer in lst file
			c.x - this.camera.x,
			c.y - this.camera.y);

		if(!intersectTest(c.x - this.camera.x, c.y - this.camera.y,		// camera test
			80, 36,
			this.eggBufferRect.x,
			this.eggBufferRect.y,
			this.eggBufferRect.width,
			this.eggBufferRect.height)) continue;

		this.eggContext.globalCompositeOperation = "source-atop";	// EGG
		this.eggContext.drawImage(_assets['art/tiles/tiles.lst'][this.map.tileInfo[e].floorTiles[i]].ptr.frameInfo[0][0].img,
			c.x - this.camera.x - this.eggBufferRect.x,
			c.y - this.camera.y - this.eggBufferRect.y);
		
	}

	if(this.inputState == "game" && this.inputState_sub == "move") {	// lower hex cursor
		_context.drawImage(_assets["art/intrface/msef000.frm"].frameInfo[0][0].img,
			this.hsIndex.x - this.camera.x,
			this.hsIndex.y - this.camera.y);
			
		this.eggContext.drawImage(_assets["art/intrface/msef000.frm"].frameInfo[0][0].img,
			this.hsIndex.x - this.camera.x - this.eggBufferRect.x,
			this.hsIndex.y - this.camera.y - this.eggBufferRect.y);
	}

	// render map objects.
	this.eggContext.globalCompositeOperation = 'source-over';
	var mapObjectsLength = this.mapObjects[e].length;
	for(var i = 0; i < mapObjectsLength; i++) {
		
		this.currentRenderObject = this.mapObjects[e][i];
		
		var c = this.mapGeometry.h2s(this.currentRenderObject.hexPosition);
		this.currentRenderImg = this.currentRenderObject.anim.img.frameInfo[this.currentRenderObject.orientation][this.currentRenderObject.anim.frameNumber];
		
		var destX = (c.x + 16 - ((this.currentRenderImg.width/2)|0)) + this.currentRenderObject.anim.shiftX - this.camera.x;	// actual coords of of objects.
		var destY = (c.y + 8 - this.currentRenderImg.height) + this.currentRenderObject.anim.shiftY - this.camera.y;
		
		if(!intersectTest(destX,		// test if object is on screen. If not - skip.		
			destY,	
			this.currentRenderImg.width,
			this.currentRenderImg.height,
			0,
			0,
			_screenWidth,
			_screenHeight)) continue;		// testing in screen space with dest vars, slower but more accurate.
		
		_context.drawImage(this.currentRenderImg.img,
			destX,
			destY);	// get dest coords in screen-space and blit.

		// render mapObjects on eggBufferRect.
		if(intersectTest(destX,
			destY,
			this.currentRenderImg.width,
			this.currentRenderImg.height,
			this.eggBufferRect.x,
			this.eggBufferRect.y,
			this.eggBufferRect.width,
			this.eggBufferRect.height)) {		// test if under eggBufferRect.

			var cCol = this.mapObjects[e][i].hexPosition % 100;
			var pCol = this.player.hexPosition % 100;

			var cRow = (this.mapObjects[e][i].hexPosition / 100)|0;
			var pRow = (this.player.hexPosition / 100)|0;			

			if(this.getObjectType(this.mapObjects[e][i].frmTypeID) == "walls") {	// don't blit walls 'infront' of player.
				if(!(cRow < pRow || cCol < pCol  )) continue;
			}
			this.eggContext.globalCompositeOperation = "source-atop";
			this.eggContext.drawImage(this.currentRenderImg.img,
				destX - this.eggBufferRect.x,
				destY - this.eggBufferRect.y);
			
			_context.globalCompositeOperation = 'source-over';
		}
		
	}	// end mapObject loop

	
	if(this.roofRenderState) {		//Render Roofs - check against roofRenderState
		for(var i = 0; i < 10000; i++) {					
			//if(this.map.tileInfo[e].roofTiles[i] < 2) continue;
				
			var c = this.mapGeometry.c2s(i);
			if(!intersectTest(c.x, c.y,
				80,
				36,
				this.camera.x,
				this.camera.y,
				_screenWidth,
				_screenHeight)) continue;
			
			_context.drawImage(_assets['art/tiles/tiles.lst'][this.map.tileInfo[e].roofTiles[i]].ptr.frameInfo[0][0].img,
				c.x - this.camera.x,
				c.y - this.mapGeometry.m_roofHeight - this.camera.y);

		}			
	}

	/* if(_debug.drawSpecialHexes) {		// Hex debug 
		var centreHex = this.mapGeometry.h2s(this.mapGeometry.s2h( 320 + this.camera.x, 190 + this.camera.y));	// hex debug stuff
		drawHex(centreHex.x - this.camera.x,centreHex.y - this.camera.y,"","#00FFFF");
		
		for(var h = 0; h < 40000; h++) {
			var cx = this.mapGeometry.h2s(h);
			if(this.map.hexMap[e][h].exitGrid) drawHex(cx.x - this.camera.x,cx.y - this.camera.y, "","#00FF00");
			if(this.map.hexMap[e][h].blocked) drawHex(cx.x - this.camera.x,cx.y - this.camera.y, "","#FF0000");	
			if(this.map.hexMap[e][h].scrollBlock) drawHex(cx.x - this.camera.x,cx.y - this.camera.y, "","#FFFF00");	
		}			
	} */
	
	_context.drawImage(this.eggBuffer,this.eggBufferRect.x,this.eggBufferRect.y);

	// Render brightmap over the top of the main screen buffer.
	if(this.mapLightLevel < 1) {
		// blit main light level to brightmap buffer.
		this.brightmapContext.fillStyle = "rgb("+((255*this.mapLightLevel)|0)+","+((255*this.mapLightLevel)|0)+","+((255*this.mapLightLevel)|0)+")";
		this.brightmapContext.fillRect(0,0,_screenWidth,_screenHeight);

		//this.brightmapContext.fillStyle = "#FFFFFF";
		//this.brightmapContext.fillRect(this.eggBufferRect.x,this.eggBufferRect.y,200,200);

		_context.globalCompositeOperation = "multiply";
		_context.drawImage(this.brightmap,0,0);

		_context.globalCompositeOperation = "source-over";	// reset
	}

	// interface
	_context.drawImage(_assets["art/intrface/iface.frm"].frameInfo[0][0].img,
		this.interfaceRect.x,
		this.interfaceRect.y);	// interface
	
	if(this.inputState == "interface" && this.interfaceRect.mouseState == 1) {
		switch(this.interfaceRect.activeItem) {
			case -1:
				break;
			case "skilldexButton":
				_context.drawImage(_assets["art/intrface/bigreddn.frm"].frameInfo[0][0].img,
					this.interfaceRect.x + this.interfaceRect.skilldexButton.x,
					this.interfaceRect.y + this.interfaceRect.skilldexButton.y);	// interface
				break;
			case "invButton":
				_context.drawImage(_assets["art/intrface/invbutdn.frm"].frameInfo[0][0].img,
					this.interfaceRect.x + this.interfaceRect.invButton.x,
					this.interfaceRect.y + this.interfaceRect.invButton.y);	// interface
				break;
			case "charButton":
				_context.drawImage(_assets["art/intrface/chadn.frm"].frameInfo[0][0].img,
					this.interfaceRect.x + this.interfaceRect.charButton.x,
					this.interfaceRect.y + this.interfaceRect.charButton.y);	// interface
				break;
			case "pipButton":
				_context.drawImage(_assets["art/intrface/pipdn.frm"].frameInfo[0][0].img,
					this.interfaceRect.x + this.interfaceRect.pipButton.x,
					this.interfaceRect.y + this.interfaceRect.pipButton.y);	// interface
				break;
			case "mapButton":
				_context.drawImage(_assets["art/intrface/mapdn.frm"].frameInfo[0][0].img,
					this.interfaceRect.x + this.interfaceRect.mapButton.x,
					this.interfaceRect.y + this.interfaceRect.mapButton.y);	// interface
				break;
			case "menuButton":
				_context.drawImage(_assets["art/intrface/optidn.frm"].frameInfo[0][0].img,
					this.interfaceRect.x + this.interfaceRect.menuButton.x,
					this.interfaceRect.y + this.interfaceRect.menuButton.y);	// interface
				break;
		}		
	}
	
	// console	
	var cl = (this.console.consoleData.length > 5) ? 5 : this.console.consoleData.length;
	for(var i = 0; i < cl; i++) {
		bitmapFontRenderer.renderString(_assets["font1.aaf"],
			this.console.consoleData[i],
			this.console.x,
			this.console.y - (i*this.console.fontHeight),
			this.console.fontColor);
	}

	// cursors
	if(this.statePause) return;		// don't render cursors if state is paused.

	if(this.inputState == "scroll") {		// if scrolling
		if(this.scrollStates.xPos) {
			if(this.scrollStates.xPosBlocked) this.scrollimg = _assets["art/intrface/screx.frm"];
			else this.scrollimg = _assets["art/intrface/screast.frm"];
		}
		if(this.scrollStates.xNeg) {
			if(this.scrollStates.xNegBlocked) this.scrollimg = _assets["art/intrface/scrwx.frm"];
			else this.scrollimg = _assets["art/intrface/scrwest.frm"];
		}
		if(this.scrollStates.yNeg) {
			if(this.scrollStates.yNegBlocked) this.scrollimg = _assets["art/intrface/scrnx.frm"];
			else this.scrollimg = _assets["art/intrface/scrnorth.frm"];
		}
		if(this.scrollStates.yNeg && this.scrollStates.xNeg) {
			if(this.scrollStates.yNegBlocked || this.scrollStates.xNegBlocked) this.scrollimg = _assets["art/intrface/scrnwx.frm"];
			else this.scrollimg = _assets["art/intrface/scrnwest.frm"];
		}
		if(this.scrollStates.yNeg && this.scrollStates.xPos) {
			if(this.scrollStates.yNegBlocked || this.scrollStates.xPosBlocked) this.scrollimg = _assets["art/intrface/scrnex.frm"];
			else this.scrollimg = _assets["art/intrface/scrneast.frm"];
		}
		if(this.scrollStates.yPos) {
			if(this.scrollStates.yPosBlocked) this.scrollimg = _assets["art/intrface/scrsx.frm"];
			else this.scrollimg = _assets["art/intrface/scrsouth.frm"];
		}
		if(this.scrollStates.yPos && this.scrollStates.xNeg) {
			if(this.scrollStates.yPosBlocked || this.scrollStates.xNegBlocked) this.scrollimg = _assets["art/intrface/scrswx.frm"];
			else this.scrollimg = _assets["art/intrface/scrswest.frm"];
		}
		if(this.scrollStates.yPos && this.scrollStates.xPos) {
			if(this.scrollStates.yPosBlocked || this.scrollStates.xNegBlocked) this.scrollimg = _assets["art/intrface/scrsex.frm"];
			else this.scrollimg = _assets["art/intrface/scrseast.frm"];
		}
		_context.drawImage(this.scrollimg.frameInfo[0][0].img,
			_mouse.x,
			_mouse.y);

	} else if(this.inputState == "interface") {		// if not scrolling	
		_context.drawImage(_assets["art/intrface/stdarrow.frm"].frameInfo[0][0].img,
			_mouse.x,
			_mouse.y);
		
	} else if(this.inputState == "game") {	// if not in HUD - on map
		switch(this.inputState_sub) {
			case "move":
				_context.globalAlpha = 0.5;
				_context.drawImage(mse_overlay,
					this.hsIndex.x - this.camera.x - 1,
					this.hsIndex.y - this.camera.y - 1);	// top hex overlay img
				_context.globalAlpha = 1;

				if(this.cIndex_path == 0) {		// render "X" if no path to location
					_context.drawImage(mse_overlay_blocked,
						this.hsIndex.x - this.camera.x + 11,
						this.hsIndex.y - this.camera.y + 3);		// top hex overlay img
				}
				break;
			case "command":
				_context.drawImage(_assets["art/intrface/actarrow.frm"].frameInfo[0][0].img,
					_mouse.x,
					_mouse.y);
				if(this.cIndex_state) {
					_context.drawImage(_assets["art/intrface/lookn.frm"].frameInfo[0][0].img,
						_mouse.x + 40,
						_mouse.y);		// "hover look" icon
				}
				break;
		}	// end switch

	}


};