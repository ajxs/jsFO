"use strict";

function mainState() {
	gameState.call(this);

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
	this.eggBuffer.width = this.eggBufferRect.width;
	this.eggBuffer.height = this.eggBufferRect.height;
	this.eggContext = this.eggBuffer.getContext("2d");
	this.transEgg = document.getElementById("trans_egg");
	
	this.brightmap = document.createElement("canvas");
	this.brightmap.width = _screenWidth;
	this.brightmap.height = _screenHeight;
	this.brightmapContext = this.brightmap.getContext("2d");
	
	this.mse_overlay = document.getElementById("mse_overlay");		// WHY FALLOUT WHY
	this.mse_overlay_blocked = document.getElementById("mse_overlay_blocked");
	
	
};

mainState.prototype = new gameState();
mainState.prototype.constructor = mainState;

mainState.prototype.map = 0;

mainState.prototype.interfaceRect = {
	x: 0,		// set in main_setResolution
	y: 0,
	width: 640,
	height: 99,
};

mainState.prototype.mapGeometry = {	// struct for map geometry vars/functions

	m_width: 100,	// nTiles in row
	h_width: 200,

	m_elevHeight: 96,

	m_origin: {
		x: 0, y: 0
	},

	h_transform: {
		x: 16, y: 12
	},

	m_tileSize: {
		width: 80, height: 36
	},


	h2s: function(i,e) {
		if(!e) e = 0;

		var q = (i%this.h_width)|0;
		var r = (i/this.h_width)|0;

		var px = 0 - q*32 + r*16, py = r*12;

		var qx = ((q/2)|0)*16;
		var qy = ((q/2)|0)*12;

		return {
			x: px + qx,
			y: py + qy + (e*this.m_elevHeight),
		}
	},

	c2s: function(i,e) {	// maptile index to screen coords
		var tx = 49, ty = -3;

		var tCol = (i%this.m_width)|0, tRow = (i/this.m_width)|0;
		return {
			x: this.m_origin.x - tx - (tCol*48) + (tRow*32),
			y: this.m_origin.y + ty + tCol*12 + (tRow*24) - e*this.m_elevHeight
		}
	},

	s2h: function(mx,my) {
		if(mx < 0) mx -= 32;    // compensate for -0 effect
		mx *= -1;

		var hCol = (mx/32)|0, hRow = (my/12)|0;
		if(hRow >0) hCol += Math.abs(hRow/2)|0;
		hRow -= (hCol/2)|0;

		return ((hRow*this.h_width)+hCol);

	},

	findAdj: function(i) {
		var adjList = new Array(6);

		adjList[0] = (i%2) ? i - (this.h_width+1) : i-1;
		adjList[1] = (i%2) ? i-1 : i + (this.h_width-1);
		adjList[2] = i+this.h_width;
		adjList[3] = (i%2) ? i+1 : i + (this.h_width+1);
		adjList[4] = (i%2) ? i-(this.h_width-1) : i+1;
		adjList[5] = i-this.h_width;

		return adjList;


	},

	findOrientation: function(_origin, _dest) {		// finds orientation between two adjacent hexes
		var adjArr = this.findAdj(_origin);
		for(var i = 0; i < 6; i++) if(_dest == adjArr[i]) return i;
		
		console.log("mainState: mapGeometry - findOrientation error");
		return 0;	// if error

	},

	hDistance: function(_a,_b) {	// pythagorean distance
		var ha = this.h2s(_a,0);
		var hb = this.h2s(_b,0);

		var dx = Math.abs(hb.x - ha.x);
		var dy = Math.abs(hb.y - ha.y);
		return Math.sqrt((dx*dx)+(dy*dy));

	},

};



mainState.prototype.hIndex = 0;
mainState.prototype.hsIndex = 0;

mainState.prototype.mse_overlay = 0;
mainState.prototype.mse_overlay_blocked = 0;

mainState.prototype.mapObjects = 0;

mainState.prototype.player = 0;
mainState.prototype.initState = false;


mainState.prototype.inputRunState = false;

mainState.prototype.scrollStates = {
	xPos: false, xNeg: false,
	yPos: false, yNeg: false,

	xPosBlocked: false, xNegBlocked: false,
	yPosBlocked: false, yNegBlocked: false,

};

mainState.prototype.objectIndex = 0;

mainState.prototype.inputState = "move";
mainState.prototype.scrollState = false;
mainState.prototype.interfaceState = false;

mainState.prototype.objectModeIndex = -1;
mainState.prototype.contextMenuActive = false;

mainState.prototype.brightmap = 0;
mainState.prototype.brightmapContext = 0;

mainState.prototype.camera = {
	x:0, y: 0,
	cameraTestBuffer : 100,
	
	trackToCoords: function(_c) {	// track camera to coordinates.
		this.x = _c.x - (_screenWidth*0.5)|0;
		this.y = _c.y - (_screenHeight*0.5)|0;
	},

	screenTest: function(_x,_y) {	// tests if coords within screen rect.
		if(_x > (this.x-this.cameraTestBuffer) &&
		_x < this.x + (_screenWidth + this.cameraTestBuffer)) {  // optimize later
			if(_y > (this.y-this.cameraTestBuffer) &&
			_y < this.y + (_screenHeight + this.cameraTestBuffer)) return true;
			else return false;
		} else return false;
	}
};


mainState.prototype.init = function(_saveState) {		// use arguments here to pass saved state data.
	console.log("mainState: Loading");
	
	// RESET MAP AND MAPOBJECT VARS
	
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


	console.log("mainState: creating hexGrid");

	this.map.hexMap = new Array(this.map.nElevations);		// init hexmap
	for(var n = 0; n < this.map.nElevations; n++) {
		this.map.hexMap[n] = new Array(40000);
		for(var h = 0; h < 40000; h++) {
			this.map.hexMap[n][h] = {
				blocked: false,
				disabled: false,
				scrollBlock: false,
			};
		}
	}

	console.log("mainState: creating mapObjects");
	this.mapObjects = new Array(this.map.nElevations);		// create / instantiate mapObjects
	for(var n = 0; n < this.map.nElevations; n++) {

		var objectInfoLength = _assets[loadMap].objectInfo[n].length;
		this.mapObjects[n] = new Array(objectInfoLength);

		for(var i = 0; i < objectInfoLength; i++) {

			this.mapObjects[n][i] = this.createMapObject(_assets[loadMap].objectInfo[n][i]);
			this.map.hexMap[n][this.mapObjects[n][i].hexPosition].blocked = true;
			
			if(this.mapObjects[n][i].hasOwnProperty("itemFlags")) {
				if(!this.mapObjects[n][i].itemFlags & 0x00000010) {	// if can be walked through
					this.map.hexMap[n][this.mapObjects[n][i].hexPosition].blocked = false;
				}
			}

			if(this.getObjectType(this.mapObjects[n][i].frmTypeID) == "misc" && this.mapObjects[n][i].frmID == 1) {
				this.map.hexMap[n][this.mapObjects[n][i].hexPosition].scrollBlock = true;
			}
		}
	}

	console.log("mainState: creating player");

	this.player = new Actor();

	this.player.PID = 0;
	this.player.objectTypeID = 1;
	this.player.objectID = 0;

	this.player.FID = 16777227;		// hmjmpsaa
	this.player.frmTypeID = 0;
	this.player.frmID = 0;

	if(_saveState.playerStartPos == "default") this.player.hexPosition = this.map.playerStartPos;
	else this.player.hexPosition = _saveState.playerStartPos;

	if(_saveState.playerStartOrientation == "default") this.player.orientation = this.map.playerStartDir;
	else this.player.orientation = _saveState.playerStartOrientation;

	this.player.currentElevation = this.map.defaultElevation;

	this.player.anim.frameNumber = 0;

	this.object_setAnim(this.player,"idle");

	this.mapObjects[this.player.currentElevation].push(this.player);

	this.contextMenu = {
		menuItems: [{
				img: _assets["art/intrface/usegetn.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/usegeth.frm"].frameInfo[0][0].img,
				action: "use",
				active: true,
			}, {
				img: _assets["art/intrface/talkn.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/talkh.frm"].frameInfo[0][0].img,
				action: "talk",
				active: true,
			}, {
				img: _assets["art/intrface/lookn.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/lookh.frm"].frameInfo[0][0].img,
				action: "look",
				active: true,
			}, {
				img: _assets["art/intrface/pushn.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/pushh.frm"].frameInfo[0][0].img,
				action: "push",
				active: false,
			},  {
				img: _assets["art/intrface/rotaten.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/rotateh.frm"].frameInfo[0][0].img,
				action: "rotate",
				active: false,
			}, {
				img: _assets["art/intrface/skilln.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/skillh.frm"].frameInfo[0][0].img,
				action: "skill",
				active: true,
			}, {
				img: _assets["art/intrface/invenn.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/invenh.frm"].frameInfo[0][0].img,
				action: "cancel",
				active: true,
			}, {
				img: _assets["art/intrface/canceln.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/cancelh.frm"].frameInfo[0][0].img,
				action: "cancel",
				active: true,
			}],

		x: 0,
		y: 0,
		mouseX: 0,
		mouseY: 0,

		targetItem: 0,

	}

	console.log("mainState: init text assets");
	_assets["text/english/game/pro_crit.msg"].msg = new Array();		// init textIDs
	for(var l = 0; l < _assets["text/english/game/pro_crit.msg"].data.length; l++) {
		var split = _assets["text/english/game/pro_crit.msg"].data[l].split("{");
		for(var k = 0; k < split.length; k++) split[k] = split[k].replace(/({|})/,"");
		_assets["text/english/game/pro_crit.msg"].msg[split[1]] = {
			soundID : split[2], text : split[3],
		}
	}

	_assets["text/english/game/pro_item.msg"].msg = new Array();
	for(var l = 0; l < _assets["text/english/game/pro_item.msg"].data.length; l++) {
		var split = _assets["text/english/game/pro_item.msg"].data[l].split("{");
		for(var k = 0; k < split.length; k++) split[k] = split[k].replace(/({|})/,"");
		_assets["text/english/game/pro_item.msg"].msg[split[1]] = {
			soundID : split[2], text : split[3],
		}
	}

	_assets["text/english/game/pro_wall.msg"].msg = new Array();
	for(var l = 0; l < _assets["text/english/game/pro_wall.msg"].data.length; l++) {
		var split = _assets["text/english/game/pro_wall.msg"].data[l].split("{");
		for(var k = 0; k < split.length; k++) split[k] = split[k].replace(/({|})/,"");
		_assets["text/english/game/pro_wall.msg"].msg[split[1]] = {
			soundID : split[2], text : split[3],
		}
	}

	_assets["text/english/game/pro_misc.msg"].msg = new Array();
	for(var l = 0; l < _assets["text/english/game/pro_misc.msg"].data.length; l++) {
		var split = _assets["text/english/game/pro_misc.msg"].data[l].split("{");
		for(var k = 0; k < split.length; k++) split[k] = split[k].replace(/({|})/,"");
		_assets["text/english/game/pro_misc.msg"].msg[split[1]] = {
			soundID : split[2], text : split[3],
		}
	}

	_assets["text/english/game/pro_tile.msg"].msg = new Array();
	for(var l = 0; l < _assets["text/english/game/pro_tile.msg"].data.length; l++) {
		var split = _assets["text/english/game/pro_tile.msg"].data[l].split("{");
		for(var k = 0; k < split.length; k++) split[k] = split[k].replace(/({|})/,"");
		_assets["text/english/game/pro_tile.msg"].msg[split[1]] = {
			soundID : split[2], text : split[3],
		}
	}

	_assets["text/english/game/pro_scen.msg"].msg = new Array();
	for(var l = 0; l < _assets["text/english/game/pro_scen.msg"].data.length; l++) {
		var split = _assets["text/english/game/pro_scen.msg"].data[l].split("{");
		for(var k = 0; k < split.length; k++) split[k] = split[k].replace(/({|})/,"");
		_assets["text/english/game/pro_scen.msg"].msg[split[1]] = {
			soundID : split[2], text : split[3],
		}
	}
	
	console.log("mainState: loading finished");

	this.camera.trackToCoords(this.mapGeometry.h2s(this.player.hexPosition));

	this.initState = true;
	this.console.print("Welcome to jsFO!");
};

mainState.prototype.getObjectType = function(_id) {		// returns type from typeID
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
			console.log("mainState: getObjectType: Can't read objectTypeID: " + _id);
			return false;	
	}	
};


mainState.prototype.generateFRMstring = function(object) {	// generates FRM string from mapObject object.

	var frmID = object.FID & 0x00000FFF;
	var filetype = this.getObjectType(object.FID >> 24);
	
	if(filetype == "critters") {
		var weaponString = "a";
		var animString = "a";
		
		var frmBase = _assets["art/critters/critters.lst"][frmID].base;
		
		if(object.armor) {
			frmBase = FIDtoFRM(object.armor.armorMaleFID);
		}
		
		if(object.leftHand) {	// ?
			switch(object.leftHand.proto.animCode) {
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
		} else weaponString = "a";
		
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

	var filename = _assets["art/" + filetype + "/" + filetype + ".lst"][frmID]
	return "art/" + filetype + "/" + filename;	
	
};


mainState.prototype.path_closedSet = 0;		// findPath vars
mainState.prototype.path_frontier = 0;
mainState.prototype.path_cameFrom = 0;
mainState.prototype.path_g_score = 0;
mainState.prototype.path_f_score = 0;
mainState.prototype.path_tg_score = 0;
mainState.prototype.path_path = 0;

mainState.prototype.path_current = 0;
mainState.prototype.path_next = 0;
mainState.prototype.path_adjList = 0;

mainState.prototype.findPath = function(start,dest) {
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
			if(this.map.hexMap[0][this.path_next].blocked) {	// if blocked
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



mainState.prototype.input = function(e) {
	if(!this.initState || this.statePause) {
		return;	// alter to account for inventory etc
	}

	if(_mouse.x > this.interfaceRect.x && _mouse.x < (this.interfaceRect.x + this.interfaceRect.width)) {
		if(_mouse.y > this.interfaceRect.y) {
			this.interfaceState = true;
		} else this.interfaceState = false;
	} else this.interfaceState = false;

	this.scrollState = false;
	if((_mouse.y > 0 && _mouse.y < _screenHeight) && (_mouse.x > 0 && _mouse.x < _screenWidth)) {	// if mouse onscreen
		if(_mouse.y < (_screenHeight * 0.05)) {
			this.scrollStates.yNeg = true;
			this.scrollState = true;
		}
		else this.scrollStates.yNeg = false;

		if(_mouse.y > (_screenHeight * 0.95)) {
			this.scrollStates.yPos = true;
			this.scrollState = true;
		}
		else this.scrollStates.yPos = false;

		if(_mouse.x < (_screenWidth * 0.05)) {
			this.scrollStates.xNeg = true;
			this.scrollState = true;
		}
		else this.scrollStates.xNeg = false;

		if(_mouse.x > (_screenWidth * 0.95)) {
			this.scrollStates.xPos = true;
			this.scrollState = true;
		}
		else this.scrollStates.xPos = false;

	} else {
		this.scrollStates.xPos = false;
		this.scrollStates.xNeg = false;
		this.scrollStates.yPos = false;
		this.scrollStates.yNeg = false;
	}


	if(e.type == 'mousemove') {

		if(this.inputState == "move") {

		} else if(this.inputState == "object") {

		}
	}

	if(e.type == 'keydown') {	// ESC
		if(_keyboardStates[27]) {
			main_ingameMenu();
			return;
		}
	}

	if(e.type == 'mousedown') {
		
		if(this.interfaceState) {
			console.log("interface md");
			return;
		}
		
		if(this.inputState == "object" && _mouse.c1) {
			this.objectIndex = this.getObjectIndex();
			if(this.objectIndex != -1) {
				this.contextMenu.mouseX = _mouse.x;
				this.contextMenu.mouseY = _mouse.y;
				this.contextMenuActive = true;

			}
		}
	} else if(e.type == 'mouseup') {
		if(this.contextMenuActive) {
			this.contextMenuAction(this.contextMenu.menuItems[this.contextMenu.targetItem].action, this.objectIndex );	// context menu action
		}

		_mouse.x = this.contextMenu.mouseX;	// reset to previous stored mouse location
		_mouse.y = this.contextMenu.mouseY;

		this.contextMenuActive = false;
	}

	if(e.type == 'click') {
		if(this.scrollState) return;
		
		if(this.interfaceState) {
			console.log("interface click");
			return;
		}
		
		if(this.inputState == "move") {
			this.actor_beginMoveState(this.player,this.hIndex,this.inputRunState);
		} else if(this.inputState == "object") {

		
		}

	}

	if(e.type =='contextmenu') {	// switch input modes on mouse2
		if(this.inputState == "move") this.inputState = "object";
		else if(this.inputState == "object") this.inputState = "move";
	}

};

mainState.prototype.contextMenuAction = function(action,target) {		// make sure elevations fixed
	switch(action) {
		case "look":
			var itemDesc = "";
			var msgFile = 0;
			var type = this.getObjectType(this.mapObjects[this.player.currentElevation][target].objectTypeID);
			switch(type) {
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
			}

			var textIndex = this.mapObjects[this.player.currentElevation][target].textID;
			if(msgFile.msg[textIndex]) {
				itemDesc = msgFile.msg[textIndex].text;
				this.console.print("You see: " + itemDesc + ".");
			} else return;

			break;
			
		case "use":
			var mState = this;
			var useDest = -1;		// find adj hexes
			var useFunction = 0;
			var useAdj = this.mapGeometry.findAdj(this.mapObjects[this.player.currentElevation][target].hexPosition);
			for(var a = 0; a < 6; a++ ) {
				if(useAdj[a] == this.player.hexPosition) {
					useDest = useAdj[a];
					break;
				}
				
				if(this.findPath(this.player.hexPosition,useAdj[a])) {
					useDest = useAdj[a];
					break;
				}
			}
			
			switch(this.mapObjects[this.player.currentElevation][target].objectType) {
				case "door":
					if(this.mapObjects[this.player.currentElevation][target].openState == 0) {	// door is closed
						useFunction = function() {
							var endCallback = function() {
								mState.object_openDoor(mState.mapObjects[mState.player.currentElevation][target]);
							};
							mState.player.orientation = mState.mapGeometry.findOrientation(mState.player.hexPosition,mState.mapObjects[mState.player.currentElevation][target].hexPosition);
							mState.object_playAnim(mState.player,"use",0,0,false,0,endCallback);
						};
					} else {
						useFunction = function() {
							var endCallback = function() {
								mState.object_closeDoor(mState.mapObjects[mState.player.currentElevation][target]);
							};
							mState.player.orientation = mState.mapGeometry.findOrientation(mState.player.hexPosition,mState.mapObjects[mState.player.currentElevation][target].hexPosition);
							mState.object_playAnim(mState.player,"use",0,0,false,0,endCallback);
						};
						
					}
					break;
			}
			
			if(useFunction) {
				if(useDest == this.player.hexPosition) useFunction();
				if(useDest != -1) {		// fix this to be correctly aligned
					this.actor_beginMoveState(this.player, useDest, this.inputRunState, useFunction);
				}
			}
			
			break;
			
		case "cancel":
			break;

	}
};

mainState.prototype.console = {
	consoleData: [],
	x: -1, y: -1,		// set in main_setResolution()

	fontHeight: 10,
	fontColor: "rgb(0,255,0)",

	print: function() {	// accepts n arguments, pushes all to console
		for (var i = 0; i < arguments.length; i++) this.consoleData.push("\x95" + arguments[i]);
	},

	clear: function() {
		this.consoleData = [];
	}
};

mainState.prototype.currentRenderObject = 0;
mainState.prototype.currentRenderImg = 0;

mainState.prototype.scrollDelta = 10;	// scroll handler
mainState.prototype.scrollCheckIndex = 0;

mainState.prototype.scrollCheckAdj = 0;

mainState.prototype.contextMenu = 0;


mainState.prototype.hIndex_time = 0;
mainState.prototype.hIndex_test = 0;
mainState.prototype.hIndex_path = -1;

mainState.prototype.oIndex_time = 0;
mainState.prototype.oIndex_x = 0;
mainState.prototype.oIndex_y = 0;
mainState.prototype.oIndex_state = 0;

mainState.prototype.objectBuffer = 0;
mainState.prototype.objectBuffer2 = 0;
mainState.prototype.objectBufferContext = 0;
mainState.prototype.objectBufferContext2 = 0;
mainState.prototype.objectBufferData = 0;

mainState.prototype.objectBufferRect = {
	x: 0,
	y: 0,
	width: 100,
	height: 100,
	
};

mainState.prototype.getObjectIndex = function() {
	var mapObjectsLength = this.mapObjects[this.player.currentElevation].length;
	
	this.objectBuffer.width = this.objectBufferRect.width;	// hack clear
	this.objectBufferRect.x = _mouse.x - this.objectBufferRect.width/2;
	this.objectBufferRect.y = _mouse.y - this.objectBufferRect.height/2;
	
	for(var i=0; i < mapObjectsLength; i++) {
		this.currentRenderObject = this.mapObjects[this.player.currentElevation][i];

		var c = this.mapGeometry.h2s(this.currentRenderObject.hexPosition,this.player.currentElevation);

		if(!this.camera.screenTest(c.x,c.y)) continue;
		this.currentRenderImg = _assets[this.currentRenderObject.anim.img].frameInfo[this.currentRenderObject.orientation][this.currentRenderObject.anim.frameNumber];

		var destX = (c.x + 16 - ((this.currentRenderImg.width/2)|0)) + this.currentRenderObject.anim.shiftX - this.camera.x;
		var destY = (c.y + 8 - this.currentRenderImg.height) + this.currentRenderObject.anim.shiftY- this.camera.y;
		
		if(destX + this.currentRenderImg.width > this.objectBufferRect.x && destX < this.objectBufferRect.x + this.objectBufferRect.width) {
			if(destY + this.currentRenderImg.height > this.objectBufferRect.y && destY < this.objectBufferRect.y + this.objectBufferRect.height) {
				
				var r = Math.floor(i/1000);
				var g = Math.floor((i%1000)/100);
				var b = i%100;				
			
				this.objectBufferContext2.globalCompositeOperation = "source-over";
				this.objectBuffer2.width = this.objectBufferRect.width;	// hack clear
			
				this.objectBufferContext2.drawImage(this.currentRenderImg.img, 0, 0, this.currentRenderImg.width, this.currentRenderImg.height, 0, 0, this.currentRenderImg.width, this.currentRenderImg.height);
				this.objectBufferContext2.globalCompositeOperation = "source-in";
				this.objectBufferContext2.fillStyle = "rgb("+r+","+g+","+b+")";
				this.objectBufferContext2.fillRect(0,0,this.currentRenderImg.width,this.currentRenderImg.height);
				
				this.objectBufferContext.drawImage(this.objectBuffer2, destX - this.objectBufferRect.x, destY - this.objectBufferRect.y);
			}
		}	
	}
	
	this.objectBufferData = this.objectBufferContext.getImageData(50, 50, 1, 1).data;	
	return this.objectBufferData[0]*1000 + this.objectBufferData[1]*100 + this.objectBufferData[2];		
	
	
};

mainState.prototype.update = function() {
	if(!this.initState || this.statePause) {
		return;	// alter to account for inventory etc
	}

	if(this.contextMenuActive) {
		this.contextMenu.targetItem = Math.min( ((_mouse.y - this.contextMenu.mouseY)/10)|0, this.contextMenu.menuItems.length-1);	// context menu action
		return;
	}

	if(this.inputState == "move") {		// get new cursor hex index, and check for blocked path cursor
		this.hIndex_test = this.mapGeometry.s2h(_mouse.x + this.camera.x, _mouse.y + this.camera.y);
		if(this.hIndex_test != this.hIndex) {
			this.hIndex = this.hIndex_test;
			this.hIndex_time = getTicks();
			this.hIndex_path = -1;
		} else {		// test for pathfind
			if(Math.abs(getTicks() - this.hIndex_time) >= 1000 && this.hIndex_path == -1) {	// if user has been hovering the mouse on a specific point for 1 sec.			
				if(this.findPath(this.player.hexPosition,this.hIndex) != 0) this.hIndex_path = 1;
				else this.hIndex_path = 0;
			} 
		}	
	}	

	this.hsIndex = this.mapGeometry.h2s(this.hIndex);

	var scrollCheck = function(i) {
		this.scrollCheckAdj = this.mapGeometry.findAdj(i);
		for(var j = 0; j < 6; j++) {
			if(this.map.hexMap[0][this.scrollCheckAdj[j]].scrollBlock) return true;	// is blocked
		}
		return false;
	};

	// do scrollcheck
	this.scrollCheckIndex = this.mapGeometry.s2h( ((_screenWidth/2)|0) + this.camera.x, ((_screenHeight*0.25)|0) + this.camera.y);	// top
	this.scrollStates.yNegBlocked = scrollCheck.call(this,this.scrollCheckIndex);

	this.scrollCheckIndex = this.mapGeometry.s2h( ((_screenWidth/2)|0) + this.camera.x, ((_screenHeight*0.75)|0) + this.camera.y);	// bottom
	this.scrollStates.yPosBlocked = scrollCheck.call(this,this.scrollCheckIndex);

	this.scrollCheckIndex = this.mapGeometry.s2h( ((_screenWidth*0.25)|0) + this.camera.x, ((_screenHeight/2)|0) + this.camera.y);	// left
	this.scrollStates.xNegBlocked = scrollCheck.call(this,this.scrollCheckIndex);

	this.scrollCheckIndex = this.mapGeometry.s2h( ((_screenWidth*0.75)|0) + this.camera.x, ((_screenHeight/2)|0) + this.camera.y);	// right
	this.scrollStates.xPosBlocked = scrollCheck.call(this,this.scrollCheckIndex);


	if(_debug.enableKeyboardScroll) {
		if(_keyboardStates[87]) this.camera.y -= this.scrollDelta;
		else if(_keyboardStates[83]) this.camera.y += this.scrollDelta;
		if(_keyboardStates[65]) this.camera.x -= this.scrollDelta;
		else if(_keyboardStates[68]) this.camera.x += this.scrollDelta;
	}


	if(this.scrollState) {		// consider changing this
		if(this.scrollStates.yNeg && !this.scrollStates.yNegBlocked) this.camera.y -= this.scrollDelta;
		if(this.scrollStates.yPos && !this.scrollStates.yPosBlocked) this.camera.y += this.scrollDelta;
		if(this.scrollStates.xNeg && !this.scrollStates.xNegBlocked) this.camera.x -= this.scrollDelta;
		if(this.scrollStates.xPos && !this.scrollStates.xPosBlocked) this.camera.x += this.scrollDelta;
	}


	if(_keyboardStates[16]) {	// SHIFT control input for running
		this.inputRunState = true;
	} else this.inputRunState = false;

	var mainStatePtr = this;	// ffs
	
	for(var e = 0; e < this.map.nElevations; e++) {		// animation
		var mapObjectsLength = this.mapObjects[e].length;

		this.mapObjects[e].sort( function(a, b) {
			var ret = a.hexPosition - b.hexPosition;
			if(ret != 0) return ret;
			else {
				var hp = mainStatePtr.mapGeometry.h2s(a.hexPosition,e);
				return (hp.y + a.anim.shiftY) - (hp.y + b.anim.shiftY);
			}
		});
		
		for(var i=0; i < mapObjectsLength; i++) {	// tasks, framestep
			this.currentRenderObject = this.mapObjects[e][i];
			this.currentRenderImg = _assets[this.currentRenderObject.anim.img];

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
							this.currentRenderObject.anim.frameNumber--;
							this.currentRenderObject.anim.shiftX -= this.currentRenderImg.frameInfo[this.currentRenderObject.orientation][this.currentRenderObject.anim.frameNumber].offsetX;
							this.currentRenderObject.anim.shiftY -= this.currentRenderImg.frameInfo[this.currentRenderObject.orientation][this.currentRenderObject.anim.frameNumber].offsetY;
						}

						if(this.currentRenderObject.anim.frameNumber == this.currentRenderObject.anim.actionFrame) {	// if action frame
							if(isFunction(this.currentRenderObject.anim.actionFrameCallback)) {
								var callback = this.currentRenderObject.anim.actionFrameCallback;	// pop callback
								this.currentRenderObject.anim.actionFrameCallback = 0;	// function is removed after being called.
								callback.call(this.currentRenderObject);
							}
						}
					} else {	// if anim ended
						if(this.currentRenderObject.anim.animLoop) {
							if(this.currentRenderObject.anim.animDirection == 0) {
								this.currentRenderObject.anim.frameNumber = 0;
								this.currentRenderObject.anim.shiftX = this.currentRenderImg.shift[this.currentRenderObject.orientation].x;
								this.currentRenderObject.anim.shiftY = this.currentRenderImg.shift[this.currentRenderObject.orientation].y;
							} else {	// reverse
								this.currentRenderObject.anim.frameNumber = this.currentRenderImg.nFrames-1;
								for(var f = 0; f < this.currentRenderImg.nFrames; f++) {	// reset shift to final
									this.currentRenderObject.anim.shiftX += this.currentRenderImg.frameInfo[this.currentRenderObject.orientation][f].offsetX;
									this.currentRenderObject.anim.shiftY += this.currentRenderImg.frameInfo[this.currentRenderObject.orientation][f].offsetY;
								}								
							}
						} else {
							this.currentRenderObject.anim.animActive = false;
						}

						if(isFunction(this.currentRenderObject.anim.animEndCallback)) {		// end anim callback
							var callback = this.currentRenderObject.anim.animEndCallback;	// pop callback
							this.currentRenderObject.anim.animEndCallback = 0;	// function is removed after being called.
							callback.call(this.currentRenderObject);
						}
						
					}				
					
					this.currentRenderObject.anim.lastFrameTime = getTicks();
				}
			}
				
		}	// end mapobjects loop
	}	// end elevations loop
	
	
	if(this.inputState == "object") {		// 'hover' look
		if(this.oIndex_state) {
			if(this.oIndex_x == _mouse.x && this.oIndex_y == _mouse.y) return;
		}
		
		if(this.oIndex_x != _mouse.x || this.oIndex_y != _mouse.y) {
			this.oIndex_x = _mouse.x;
			this.oIndex_y = _mouse.y;
			this.oIndex_time = getTicks();
			this.oIndex_state = false;
		} else {
			if(Math.abs(getTicks() - this.oIndex_time) >= 1000) {	// if user has been hovering the mouse on a specific point for 1 sec.
				this.objectIndex = this.getObjectIndex();
				if(this.objectIndex != -1) {
					this.contextMenuAction("look",this.objectIndex);
					this.oIndex_time = getTicks();
					this.oIndex_state = true;					
				}
			}
		}
	}

}

mainState.prototype.mapLightLevel = 1;
mainState.prototype.scrollimg = 0;

mainState.prototype.transEgg = 0;
mainState.prototype.eggBuffer = 0;
mainState.prototype.eggContext = 0;
mainState.prototype.eggBufferRect = {
	x: 0, y: 0,
	width: 129,
	height: 98,
	objectTest: function(_x,_y) {
		var db = 200;
		if(_x > (this.x - db) && _x < this.x + this.width + db) {
			if(_y > (this.y - db) && _y < this.y + this.height + db) return true;
			else return false
		} else return false
	},
};

mainState.prototype.render = function() {
	if(!this.initState) return;
	
	this.eggContext.globalCompositeOperation = 'source-over';	// EGG
	this.eggContext.drawImage(this.transEgg,0,0);

	var playerCoords = this.mapGeometry.h2s(this.player.hexPosition);
	var playerX = playerCoords.x + 16 + this.player.anim.shiftX - this.camera.x;
	var playerY = (playerCoords.y + 8) + this.player.anim.shiftY- this.camera.y;

	this.eggBufferRect.x = playerX - (this.eggBufferRect.width/2)|0;
	this.eggBufferRect.y = playerY - ((this.eggBufferRect.height/2)|0) - 35;	// fix this
	
	
	for(var e = 0; e < this.map.nElevations; e++) {
		for(var i = 0; i < 10000; i++) {	// floor tiles
			var c = this.mapGeometry.c2s(i,e);
			if(!this.camera.screenTest(c.x, c.y)) continue;
			/* contemplate changing this system to utilize the hexPosition of the object, and compare it to the hex indexes of the top right and bottom right corners */
			if(this.map.tileInfo[e].floorTiles[i] > 1) {
				var tileName = _assets['art/tiles/tiles.lst'][this.map.tileInfo[e].floorTiles[i]]
				_context.drawImage(_assets[ "art/tiles/" + tileName ].frameInfo[0][0].img, c.x - this.camera.x, c.y - this.camera.y);
				
				if(!this.eggBufferRect.objectTest(c.x - this.camera.x ,c.y - this.camera.y)) continue;
				this.eggContext.globalCompositeOperation = "source-atop";	// EGG
				this.eggContext.drawImage(_assets[ "art/tiles/" + tileName ].frameInfo[0][0].img, c.x - this.camera.x - this.eggBufferRect.x, c.y - this.camera.y - this.eggBufferRect.y);
			}
		}

		if(!this.statePause && !this.scrollState && !this.interfaceState && this.inputState == "move") {	// lower hex cursor
			_context.drawImage(_assets["art/intrface/msef000.frm"].frameInfo[0][0].img, this.hsIndex.x - this.camera.x, this.hsIndex.y - this.camera.y);
			this.eggContext.drawImage(_assets["art/intrface/msef000.frm"].frameInfo[0][0].img, this.hsIndex.x - this.camera.x - this.eggBufferRect.x, this.hsIndex.y - this.camera.y - this.eggBufferRect.y);
		}
		
		var mapObjectsLength = this.mapObjects[e].length;
		for(var i = 0; i < mapObjectsLength; i++) {
			this.currentRenderObject = this.mapObjects[e][i];

			var c = this.mapGeometry.h2s(this.currentRenderObject.hexPosition,e);

			if(!this.camera.screenTest(c.x,c.y)) continue;

			this.currentRenderImg = _assets[this.currentRenderObject.anim.img].frameInfo[this.currentRenderObject.orientation][this.currentRenderObject.anim.frameNumber];

			var destX = (c.x + 16 - ((this.currentRenderImg.width/2)|0)) + this.currentRenderObject.anim.shiftX - this.camera.x;
			var destY = (c.y + 8 - this.currentRenderImg.height) + this.currentRenderObject.anim.shiftY- this.camera.y;

			_context.drawImage(this.currentRenderImg.img, destX, destY);

			var cCol = this.mapObjects[e][i].hexPosition % 100;
			var pCol = this.player.hexPosition % 100;
			
			var cRow = (this.mapObjects[e][i].hexPosition / 100)|0;
			var pRow = (this.player.hexPosition / 100)|0;
			
			if(!this.eggBufferRect.objectTest(destX, destY)) continue;
			this.eggContext.globalCompositeOperation = "source-atop";		// this was moved from inside if(cRow....
			if(this.getObjectType(this.mapObjects[e][i].frmTypeID) == "walls") {
				if(cRow < pRow || cCol < pCol  ) {	// conditions for wall transparency
					this.eggContext.drawImage(this.currentRenderImg.img, destX - this.eggBufferRect.x, destY - this.eggBufferRect.y);
				}					
			} else {
				this.eggContext.drawImage(this.currentRenderImg.img, destX - this.eggBufferRect.x, destY - this.eggBufferRect.y);
			}
		}	// end mapObject loop
		
		for(var i = 0; i < 10000; i++) {		// change this to target x: 0, y:0 
			var c = this.mapGeometry.c2s(i,e);
			if(!this.camera.screenTest(c.x,c.y)) continue;
	
			if(this.map.tileInfo[e].roofTiles[i] > 1) _context.drawImage(_assets[ "art/tiles/" + _assets['art/tiles/tiles.lst'][this.map.tileInfo[e].roofTiles[i]] ].frameInfo[0][0].img,
				c.x - this.camera.x, c.y - 96 - this.camera.y);
		}

	}	// end elevations loop
	
	_context.globalCompositeOperation = 'source-over';
	_context.drawImage(this.eggBuffer,this.eggBufferRect.x,this.eggBufferRect.y);

	if(this.mapLightLevel < 1) {	// brightmap
		this.brightmapContext.fillStyle = "rgb("+((255*this.mapLightLevel)|0)+","+((255*this.mapLightLevel)|0)+","+((255*this.mapLightLevel)|0)+")";
		this.brightmapContext.fillRect(0,0,_screenWidth,_screenHeight);
		
		this.brightmapContext.fillStyle = "#FFFFFF";
		this.brightmapContext.fillRect(this.eggBufferRect.x,this.eggBufferRect.y,200,200);
	
		_context.globalCompositeOperation = "multiply";
		_context.drawImage(this.brightmap,0,0);
		
		_context.globalCompositeOperation = "source-over";	// reset
	}
	
	// interface
	_context.drawImage(_assets["art/intrface/iface.frm"].frameInfo[0][0].img, this.interfaceRect.x, this.interfaceRect.y);	// interface

	// console
	for(var i = 0; i < 5; i++) {	// iterate backwards through console
		if(!this.console.consoleData[((this.console.consoleData.length-1) - i)]) break;			
		bitmapFontRenderer.renderString(_assets["font1.aaf"], this.console.consoleData[((this.console.consoleData.length-1) - i)], this.console.x, this.console.y - (i*this.console.fontHeight), "#00FF00");
	}

		
	// cursors
	if(this.statePause) return;		// don't render cursors if state is paused.
	
	if(this.inputState == "object") {		
		if(this.contextMenuActive) {	// context menu
			var objC = this.mapGeometry.h2s(this.mapObjects[this.player.currentElevation][this.objectIndex].hexPosition);
			this.contextMenu.x = objC.x + 30 - this.camera.x;
			this.contextMenu.y = objC.y - 60 - this.camera.y;

			var nItems = 0;		// only render 'active' items.
			for(var c = 0; c < this.contextMenu.menuItems.length; c++) {
				if(this.contextMenu.menuItems[c].active) {
					if(c == this.contextMenu.targetItem) {
						_context.drawImage(this.contextMenu.menuItems[c].hoverImg, this.contextMenu.x, this.contextMenu.y+(40*nItems));
					} else {
						_context.drawImage(this.contextMenu.menuItems[c].img, this.contextMenu.x, this.contextMenu.y+(40*nItems));
					}
					nItems++;
				}
			}
		} else if(this.oIndex_state) {			
			_context.drawImage(_assets["art/intrface/lookn.frm"].frameInfo[0][0].img, _mouse.x + 40, _mouse.y);
		}		
	}
	
	if(this.scrollState) {		// if scrolling
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
		_context.drawImage(this.scrollimg.frameInfo[0][0].img, _mouse.x, _mouse.y);

	} else {	// if not scrolling
		if(this.interfaceState) {
			_context.drawImage(_assets["art/intrface/stdarrow.frm"].frameInfo[0][0].img, _mouse.x, _mouse.y);
		} else {	// if not in HUD - on map
			switch(this.inputState) {
				case "move":
					if(this.inputState == "move") {						
						_context.globalAlpha = 0.5;
						_context.drawImage(mse_overlay, this.hsIndex.x - this.camera.x - 1, this.hsIndex.y - this.camera.y - 1);	// top hex overlay img						
						_context.globalAlpha = 1;
						
						if(this.hIndex_path == 0) {		// render "X" if no path to location
							_context.drawImage(mse_overlay_blocked, this.hsIndex.x - this.camera.x + 11, this.hsIndex.y - this.camera.y + 3);		// top hex overlay img
						}						
					}
					break;
				case "object":
					_context.drawImage(_assets["art/intrface/actarrow.frm"].frameInfo[0][0].img, (this.contextMenuActive) ? this.contextMenu.mouseX : _mouse.x, (this.contextMenuActive) ? this.contextMenu.mouseY : _mouse.y);
					break;
			}	// end switch

		}

	}

}