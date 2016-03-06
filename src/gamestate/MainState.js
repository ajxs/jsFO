'use strict';

class MainState extends GameState {
	constructor() {
		super();

		this.map = {
			hexMap: 0,
			hexStatus(i,e) {
				return !this.hexMap[e][i].blocked;
			},
		};

		this.interfaceRect = new Interface('jsfdata/interface/mainStateInterface.json');

		this.console = {
			consoleData: [],
			x: 30,
			y: 454,

			fontHeight: 10,
			fontColor: "#00FF00",

			print: function() {	// accepts n arguments, pushes all to console
				for(let i = 0; i < arguments.length; i++) {
					let string = "\x95" + arguments[i];
					let split = string.match(/.{1,22}/g);	// split string to line width
					for(let k = 0; k < split.length; k++) this.consoleData.unshift(split[k]);
				}
			},

			clear: function() {
				this.consoleData = [];
			}
		};

		/*
		objectBuffer and objectBuffer2 are utilized for picking the pixel precise screen object the cursor is over during an action.
		It works by 'stenciling' sprites to the buffer in a 'paint by numbers' manner, painting a unique colour for each object. This can then be reversed to find the object under the cursor.
		object buffer canvas size CAN be modified with few ill effects.
		*/

		this.objectBufferRect = {
			x: 0, y: 0,
			width: 100, height: 100
		};

		this.eggBufferRect = {
			x: 0, y: 0,
			width: 129, height: 98,
		};

		this.objectBuffer = document.createElement("canvas");
		this.objectBufferContext = this.objectBuffer.getContext("2d");

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

		/*
		Do not modify transEgg canvas size, it's position is centered around the player by it's width. This may be fixed at a later date by hardcoding the width.
		*/


		this.brightmap = document.createElement("canvas");
		this.brightmap.width = SCREEN_WIDTH;
		this.brightmap.height = SCREEN_HEIGHT;
		this.brightmapContext = this.brightmap.getContext("2d");

		this.vm = new ScriptVM();


		this.currentRenderObject = 0;
		this.currentRenderImg = 0;

		this.scrollDelta = 5;	// scroll handler
		this.scrollCheckIndex = 0;

		this.scrollCheckAdj = 0;

		this.hIndex = 0;
		this.hsIndex = 0;

		this.mapObjects = 0;

		this.player = 0;

		this.inputRunState = false;

		this.scrollStates = {
			xPos: false, xNeg: false,
			yPos: false, yNeg: false,

			xPosBlocked: false, xNegBlocked: false,
			yPosBlocked: false, yNegBlocked: false,

		};

		this.objectIndex = 0;

		this.inputState = "game";
		this.inputState_sub = "move";

		this.roofRenderState = 0;

		this.camera = {
			x:0, y: 0,

			trackToCoords(_c) {	// track camera to coordinates.
				this.x = _c.x - (SCREEN_WIDTH*0.5)|0;
				this.y = _c.y - (SCREEN_HEIGHT*0.5)|0;
			},
		};


		this.mapLightLevel = 1;
		this.scrollimg = 0;


		this.cIndex_time;
		this.cIndex_test;
		this.cIndex_state = false;
		this.cIndex_path = -1;

		this.cIndex_x;
		this.cIndex_y;

		this.path_closedSet = 0;		// findPath vars
		this.path_frontier = 0;
		this.path_cameFrom = 0;
		this.path_g_score = 0;
		this.path_f_score = 0;
		this.path_tg_score = 0;
		this.path_path = 0;

		this.path_current = 0;
		this.path_next = 0;
		this.path_adjList = 0;


	};


	findPath(start,dest) {
		if(start == dest) return 0;

		this.path_closedSet = [];
		this.path_frontier = [start];
		this.path_cameFrom = [];
		this.path_g_score = [];
		this.path_f_score = [];

		this.path_g_score[start] = 0;
		this.path_f_score[start] = mapGeometry.hDistance(start,dest);

		while(this.path_frontier.length) {
			this.path_current = this.path_frontier[0];

			for(let k = 0; k < this.path_frontier.length; k++) {	// get lowest f_score - O(1)
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

			this.path_adjList = mapGeometry.findAdj(this.path_current);
			this.path_closedSet.push(this.path_frontier.shift());

			for(let i = 0; i < 6; i++) {
				this.path_next = this.path_adjList[i];

				if(this.path_next < 0 || this.path_next > 40000) continue;	// if out of bounds
				if(this.path_closedSet.indexOf(this.path_next) != -1) continue;	// if in closedList
				if(this.map.hexMap[this.player.currentElevation][this.path_next].blocked) {	// if blocked
					this.path_closedSet.push(this.path_next);
					continue;
				}

				this.path_tg_score = this.path_g_score[this.path_current] + mapGeometry.hDistance(this.path_current,this.path_next);

				if(this.path_frontier.indexOf(this.path_next) == -1 || this.path_tg_score < this.path_g_score[this.path_next]) {
					this.path_cameFrom[this.path_next] = this.path_current;
					this.path_g_score[this.path_next] = this.path_tg_score;
					this.path_f_score[this.path_next] = this.path_g_score[this.path_next] + mapGeometry.hDistance(this.path_next,dest);
					if(this.path_frontier.indexOf(this.path_next) == -1) this.path_frontier.push(this.path_next);
				}
			}
		}

		return 0;

	};



	loadSaveState(_saveState) {		// use arguments here to pass saved state data.
		console.log("MainState: init: " + _saveState.map);

		let loadMap = "maps/" + _saveState.map;
		this.map.defaultElevation = _assets[loadMap].defaultElevation;		// copy map lets
		this.map.elevationAt0 = _assets[loadMap].elevationAt0;
		this.map.elevationAt1 = _assets[loadMap].elevationAt1;
		this.map.elevationAt2 = _assets[loadMap].elevationAt2;
		this.map.nElevations = _assets[loadMap].nElevations;

		this.map.globalvars = _assets[loadMap].globalvars;
		this.map.localvars = _assets[loadMap].localvars;

		this.map.playerStartDir = _assets[loadMap].playerStartDir;
		this.map.playerStartPos = _assets[loadMap].playerStartPos;

		this.map.tileInfo = _assets[loadMap].tileInfo;

		console.log("MainState: init: initializing hexGrid");
		this.map.hexMap = new Array(this.map.nElevations);		// init/reset hexmap
		this.mapObjects = new Array(this.map.nElevations);		// create / instantiate mapObjects

		console.log("MainState: init: loading mapObjects");

		for(let n = 0; n < this.map.nElevations; n++) {

			this.map.hexMap[n] = new Array(40000).fill(0).map(hex => ({
					blocked: false,
					disabled: false,
					scrollBlock: false
				}));

			let objectInfoLength = _assets[loadMap].objectInfo[n].length;
			this.mapObjects[n] = new Array(objectInfoLength);

			for(let i = 0; i < objectInfoLength; i++) {

				this.mapObjects[n][i] = this.createMapObject(_assets[loadMap].objectInfo[n][i]);

				if(!(this.mapObjects[n][i].itemFlags & 0x00000010)) this.map.hexMap[n][this.mapObjects[n][i].hexPosition].blocked = true;	// check if flags for 'can be walked through' are false.

				switch(getObjectType(this.mapObjects[n][i].frmTypeID)) {
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

		this.camera.trackToCoords(mapGeometry.h2s(this.player.hexPosition));

		return true;

	};

	createSaveState(_map, _pos = 'default', _elev = 'default', _orientation = 'default') {	// creates a gamestate for MainState to load to facilitate switching maps.
		let saveState = {}

		saveState.map = _assets["data/maps.txt"][_map].mapName + ".map";

		saveState.playerStartPos = _pos,
		saveState.playerStartOrientation = _orientation,
		saveState.playerStartElevation = _elev,

		saveState.player = this.player;		// save player
		return saveState;
	};


	exitMap(_map,_pos,_elev,_orientation) {
		this.actor_endMoveState(this.player);	// reset movement lets so player doesn't get stuck in an unfinishable moveState when switching maps
		main_loadGame(this.createSaveState(_map,_pos,_elev,_orientation));
	};


	input(e) {
		switch(e.type) {
			case "mousemove":
				break;
			case "keydown":
				if(_keyboard['Escape']) {
					main_gameStateFunction('openIngameMenu');
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
							let objC = mapGeometry.h2s(this.mapObjects[this.player.currentElevation][this.objectIndex].hexPosition);
							// Context Menu
							contextMenuState.setMenuItems(this.objectIndex,
								objC.x - this.camera.x + 30,
								objC.y - this.camera.y - 20);
							main_gameStateFunction('openContextMenu');
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
					let clickIndex = this.interfaceRect.clickHandler();
					if(clickIndex) main_gameStateFunction(clickIndex);
					this.interfaceRect.activeItem = -1;

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

	contextMenuAction(action,target) {
		if(target == -1) return;

		switch(action) {
			case "hoverlook":
			case "look":

				let textIndex, msgFile;
				if(action == "hoverlook") textIndex = this.mapObjects[this.player.currentElevation][target].textID;
				else if(action == "look") textIndex = this.mapObjects[this.player.currentElevation][target].textID+1;

				switch( getObjectType(this.mapObjects[this.player.currentElevation][target].objectTypeID) ) {
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
				let useDest = -1;		// find adj hexes
				let useFunction = 0;
				let targetItem = this.mapObjects[this.player.currentElevation][target];

				console.log(targetItem);

				let useAdj = mapGeometry.findAdj(targetItem.hexPosition);

				useDest = useAdj.indexOf(this.player.hexPosition);	// check if player next to item
				for(let a = 0; a < 6; a++) {
					if(this.findPath(this.player.hexPosition,useAdj[a])) {
						useDest = useAdj[a];
						break;
					}
				}

				switch(targetItem.objectType) {
					case "door":
						useFunction = function() {
							//console.log("useFunction: " + targetItem.hexPosition + " / " + mainState.player.hexPosition);
							this.player.orientation = mapGeometry.findOrientation(this.player.hexPosition, targetItem.hexPosition);
							this.object_playAnim(this.player,"use",0,0,0,false,0, () => {
								if(targetItem.openState == 0) this.object_openDoor(targetItem);
								else this.object_closeDoor(targetItem);
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


	getObjectIndex() {		//@TODO: Refactor
		// this function stencils screen objects onto an offscreen buffer, with a solid color based upon that object's position in the mapObjects array.
		// from this function you can accurately find the object under the cursor by blitting the objects 50px around the cursor onto the buffer, then reading the color underneath the centre of the image.
		// from the formula r*1000 + b*100 + g we can find the index of the object.

		this.objectBufferRect.x = _mouse.x - this.objectBufferRect.width/2;
		this.objectBufferRect.y = _mouse.y - this.objectBufferRect.height/2;

		for(let i = 0, mapObjectsLength = this.mapObjects[this.player.currentElevation].length; i < mapObjectsLength; i++) {
			this.currentRenderObject = this.mapObjects[this.player.currentElevation][i];

			let c = mapGeometry.h2s(this.currentRenderObject.hexPosition);
			this.currentRenderImg = this.currentRenderObject.anim.img.frameInfo[this.currentRenderObject.orientation][this.currentRenderObject.anim.frameNumber];

			let destX = (c.x + 16 - ((this.currentRenderImg.width/2)|0)) + this.currentRenderObject.anim.shiftX - this.camera.x;	// object coords.
			let destY = (c.y + 8 - this.currentRenderImg.height) + this.currentRenderObject.anim.shiftY- this.camera.y;

			if(!intersectTest(destX, destY,
				this.currentRenderImg.width,
				this.currentRenderImg.height,
				this.objectBufferRect.x,
				this.objectBufferRect.y,
				this.objectBufferRect.width,
				this.objectBufferRect.height)) continue;


			let cCol = this.currentRenderObject.hexPosition % 100;
			let pCol = this.player.hexPosition % 100;

			let cRow = (this.currentRenderObject.hexPosition / 100)|0;
			let pRow = (this.player.hexPosition / 100)|0;

			if(getObjectType(this.currentRenderObject.frmTypeID) == "walls") {	// don't blit walls 'infront' of player.
				if(!(cRow < pRow || cCol < pCol  )) continue;
			}

			this.objectBufferContext2.globalCompositeOperation = "source-over";
			this.objectBuffer2.width = this.objectBufferRect.width;	// hack clear

			//this.objectBufferContext2.drawImage(this.currentRenderImg.img,
			//	0, 0);

			blitFRM(this.currentRenderObject.anim.img,
				this.objectBufferContext2,
				0, 0,
				this.currentRenderObject.orientation,
				this.currentRenderObject.anim.frameNumber);

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


	update() {

		// STATE HANDLING
		this.scrollStates.yNeg = (_mouse.y < (SCREEN_HEIGHT * 0.025));
		this.scrollStates.yPos = (_mouse.y > (SCREEN_HEIGHT * 0.975));
		this.scrollStates.xNeg = (_mouse.x < (SCREEN_WIDTH * 0.025));
		this.scrollStates.xPos = (_mouse.x > (SCREEN_WIDTH * 0.975));
		this.scrollState = (this.scrollStates.yNeg || this.scrollStates.yPos || this.scrollStates.xNeg || this.scrollStates.xPos);

		if(intersectTest(_mouse.x,_mouse.y,0,0, 0,0,SCREEN_WIDTH,SCREEN_HEIGHT) && this.scrollState) {
			this.inputState = "scroll";

			this.scrollCheckAdj = mapGeometry.findAdj(mapGeometry.s2h( 320 + this.camera.x, 190 + this.camera.y));

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
			this.interfaceRect.update();		//@TODO: bug here

		} else {
			this.inputState = "game";

			if(this.inputState_sub == "move") {
				this.hIndex = mapGeometry.s2h(_mouse.x + this.camera.x, _mouse.y + this.camera.y);		// hex index calculated here
				this.hsIndex = mapGeometry.h2s(this.hIndex);

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


		if(_keyboard['ShiftRight'] || _keyboard['ShiftLeft']) {	// SHIFT control input for running
			this.inputRunState = true;
		} else this.inputRunState = false;


		let e = this.player.currentElevation;
		this.mapObjects[e].sort((a, b) => {	// z-sort
			return ((a.hexPosition - b.hexPosition) || (a.anim.shiftY - b.anim.shiftY));
		});


		// animation
		for(let i=0, mapObjectsLength = this.mapObjects[e].length; i < mapObjectsLength; i++) {	// tasks, framestep
			this.currentRenderObject = this.mapObjects[e][i];

			this.currentRenderImg = this.currentRenderObject.anim.img;

			if(this.currentRenderObject.anim.animActive) {	// framestep and animation functions
				this.currentRenderObject.anim.animDelta = (getTicks() - this.currentRenderObject.anim.lastFrameTime);
				if(this.currentRenderObject.anim.animDelta >= (1000/this.currentRenderImg.fps)) {	// if time to update frame.

					let cond = (this.currentRenderObject.anim.animDirection == 0) ? this.currentRenderObject.anim.frameNumber < this.currentRenderImg.nFrames-1 : this.currentRenderObject.anim.frameNumber > 0;
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


		let playerCoords = mapGeometry.h2s(this.player.hexPosition);
		this.currentRenderImg = this.player.anim.img.frameInfo[this.player.orientation][this.player.anim.frameNumber];

		let playerX = (playerCoords.x + 16 - ((this.currentRenderImg.width/2)|0)) + this.player.anim.shiftX - this.camera.x;	// actual coords of of objects.
		let playerY = (playerCoords.y + 8 - this.currentRenderImg.height) + this.player.anim.shiftY - this.camera.y;


		this.roofRenderState = true;		// check if player is under a roof
		for(let i = 0; i < 10000; i++) {
			if(this.map.tileInfo[this.player.currentElevation].roofTiles[i] < 2) continue;
			let c = mapGeometry.c2s(i);

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


	render() {

		this.eggBuffer.width = 300;		// clear eggBuffer hack. @TODO: Replace with a version hardcoded to eggBufferRect.width - resolve once issue with Chrome rendering is fixed.
		this.eggContext.globalCompositeOperation = 'source-over';		// draw egg mask onto egg context.
		this.eggContext.drawImage(this.transEgg,0,0);

		let playerCoords = mapGeometry.h2s(this.player.hexPosition);
		let playerX = playerCoords.x + 16 + this.player.anim.shiftX - this.camera.x;
		let playerY = (playerCoords.y + 8) + this.player.anim.shiftY- this.camera.y;

		this.eggBufferRect.x = playerX - (this.eggBufferRect.width/2)|0;
		this.eggBufferRect.y = playerY - ((this.eggBufferRect.height/2)|0) - 35;	// @TODO: fix this

		let e = this.player.currentElevation;

		// render floor tiles.
		for(let i = 0; i < 10000; i++) {

			//if(this.map.tileInfo[e].floorTiles[i] < 2) continue;

			let c = mapGeometry.c2s(i);
			if(!intersectTest(c.x, c.y,		// camera test
				80, 36,
				this.camera.x,
				this.camera.y,
				SCREEN_WIDTH,
				SCREEN_HEIGHT)) continue;

			blitFRM(_assets['art/tiles/tiles.lst'][this.map.tileInfo[e].floorTiles[i]].ptr,
				_context,
				c.x - this.camera.x,
				c.y - this.camera.y);

			if(!intersectTest(c.x - this.camera.x, c.y - this.camera.y,		// camera test
				80, 36,
				this.eggBufferRect.x,
				this.eggBufferRect.y,
				this.eggBufferRect.width,
				this.eggBufferRect.height)) continue;

			this.eggContext.globalCompositeOperation = "source-atop";	// EGG

			blitFRM(_assets['art/tiles/tiles.lst'][this.map.tileInfo[e].floorTiles[i]].ptr,
				this.eggContext,
				c.x - this.camera.x - this.eggBufferRect.x,
				c.y - this.camera.y - this.eggBufferRect.y);


		}

		if(this.inputState == "game" && this.inputState_sub == "move") {	// lower hex cursor
			blitFRM(_assets["art/intrface/msef000.frm"],
				_context,
				this.hsIndex.x - this.camera.x,
				this.hsIndex.y - this.camera.y);

			blitFRM(_assets["art/intrface/msef000.frm"],
				this.eggContext,
				this.hsIndex.x - this.camera.x - this.eggBufferRect.x,
				this.hsIndex.y - this.camera.y - this.eggBufferRect.y);
		}

		// render map objects.
		this.eggContext.globalCompositeOperation = 'source-over';
		for(let i = 0, mapObjectsLength = this.mapObjects[e].length; i < mapObjectsLength; i++) {

			this.currentRenderObject = this.mapObjects[e][i];

			let c = mapGeometry.h2s(this.currentRenderObject.hexPosition);
			this.currentRenderImg = this.currentRenderObject.anim.img.frameInfo[this.currentRenderObject.orientation][this.currentRenderObject.anim.frameNumber];		//@TODO: clean

			let destX = (c.x + 16 - ((this.currentRenderImg.width/2)|0)) + this.currentRenderObject.anim.shiftX - this.camera.x;	// actual coords of of objects.
			let destY = (c.y + 8 - this.currentRenderImg.height) + this.currentRenderObject.anim.shiftY - this.camera.y;

			if(!intersectTest(destX,		// test if object is on screen. If not - skip.
				destY,
				this.currentRenderImg.width,
				this.currentRenderImg.height,
				0,
				0,
				SCREEN_WIDTH,
				SCREEN_HEIGHT)) continue;		// testing in screen space with dest lets, slower but more accurate.

			blitFRM(this.currentRenderObject.anim.img,
				_context,
				destX,
				destY,
				this.currentRenderObject.orientation,
				this.currentRenderObject.anim.frameNumber);	// get dest coords in screen-space and blit.

			// render mapObjects on eggBufferRect.
			if(intersectTest(destX,
				destY,
				this.currentRenderImg.width,
				this.currentRenderImg.height,
				this.eggBufferRect.x,
				this.eggBufferRect.y,
				this.eggBufferRect.width,
				this.eggBufferRect.height)) {		// test if under eggBufferRect.

				let cCol = this.mapObjects[e][i].hexPosition % 100;
				let pCol = this.player.hexPosition % 100;

				let cRow = (this.mapObjects[e][i].hexPosition / 100)|0;
				let pRow = (this.player.hexPosition / 100)|0;

				if(getObjectType(this.mapObjects[e][i].frmTypeID) == "walls") {	// don't blit walls 'infront' of player.
					if(!(cRow < pRow || cCol < pCol  )) continue;
				}
				this.eggContext.globalCompositeOperation = "source-atop";

				blitFRM(this.currentRenderObject.anim.img,
					this.eggContext,
					destX - this.eggBufferRect.x,
					destY - this.eggBufferRect.y,
					this.currentRenderObject.orientation,
					this.currentRenderObject.anim.frameNumber);	// get dest coords in screen-space and blit.

				_context.globalCompositeOperation = 'source-over';
			}

		}	// end mapObject loop


		if(this.roofRenderState) {		//Render Roofs - check against roofRenderState
			for(let i = 0; i < 10000; i++) {
				//if(this.map.tileInfo[e].roofTiles[i] < 2) continue;

				let c = mapGeometry.c2s(i);
				if(!intersectTest(c.x, c.y,
					80,
					36,
					this.camera.x,
					this.camera.y,
					SCREEN_WIDTH,
					SCREEN_HEIGHT)) continue;

				blitFRM(_assets['art/tiles/tiles.lst'][this.map.tileInfo[e].roofTiles[i]].ptr,
					_context,
					c.x - this.camera.x,
					c.y - mapGeometry.m_roofHeight - this.camera.y);

			}
		}

		if(DEBUG_FLAGS.drawSpecialHexes) {		// Hex debug
			let centreHex = mapGeometry.h2s(mapGeometry.s2h( 320 + this.camera.x, 190 + this.camera.y));	// hex debug stuff
			drawHex(centreHex.x - this.camera.x, centreHex.y - this.camera.y, "", "#00FFFF");

			for(let h = 0; h < 40000; h++) {
				let cx = mapGeometry.h2s(h);
				if(this.map.hexMap[e][h].exitGrid) drawHex(cx.x - this.camera.x, cx.y - this.camera.y, "", "#00FF00");
				if(this.map.hexMap[e][h].blocked) drawHex(cx.x - this.camera.x, cx.y - this.camera.y, "", "#FF0000");
				if(this.map.hexMap[e][h].scrollBlock) drawHex(cx.x - this.camera.x, cx.y - this.camera.y, "", "#FFFF00");
			}
		}

		_context.drawImage(this.eggBuffer,this.eggBufferRect.x,this.eggBufferRect.y);

		// Render brightmap over the top of the main screen buffer.
		if(this.mapLightLevel < 1) {
			// blit main light level to brightmap buffer.
			this.brightmapContext.fillStyle = "rgb("+((255*this.mapLightLevel)|0)+","+((255*this.mapLightLevel)|0)+","+((255*this.mapLightLevel)|0)+")";
			this.brightmapContext.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);

			//this.brightmapContext.fillStyle = "#FFFFFF";
			//this.brightmapContext.fillRect(this.eggBufferRect.x,this.eggBufferRect.y,200,200);

			_context.globalCompositeOperation = "multiply";
			_context.drawImage(this.brightmap,0,0);

			_context.globalCompositeOperation = "source-over";	// reset
		}

		// interface

		blitFRM(_assets["art/intrface/iface.frm"],
			_context,
			this.interfaceRect.x,
			this.interfaceRect.y);


		if(this.inputState == "interface" && this.interfaceRect.mouseState == 1) {		// interface
			if(this.interfaceRect.activeItem > -1) {

				blitFRM(_assets[ this.interfaceRect.elements[this.interfaceRect.activeItem].downSprite ],
					_context,
					this.interfaceRect.x + this.interfaceRect.elements[this.interfaceRect.activeItem].x,
					this.interfaceRect.y + this.interfaceRect.elements[this.interfaceRect.activeItem].y);
			}
		}

		// console
		for(let i = 0,  cl = (this.console.consoleData.length > 5) ? 5 : this.console.consoleData.length; i < cl; i++) {
			blitFontString(_assets["font1.aaf"],
				_context,
				this.console.consoleData[i],
				this.console.x,
				this.console.y - (i*this.console.fontHeight),
				this.console.fontColor);
		}

		// cursors
		if(this.statePause) return;		// don't render cursors if state is paused.

		if(this.inputState == "scroll") {		// if scrolling
			if(this.scrollStates.xPos) this.scrollimg = (this.scrollStates.xPosBlocked) ? _assets["art/intrface/screx.frm"] : _assets["art/intrface/screast.frm"];
			if(this.scrollStates.xNeg) this.scrollimg = (this.scrollStates.xNegBlocked) ? _assets["art/intrface/scrwx.frm"] : _assets["art/intrface/scrwest.frm"];
			if(this.scrollStates.yNeg) this.scrollimg = (this.scrollStates.yNegBlocked) ? _assets["art/intrface/scrnx.frm"] : _assets["art/intrface/scrnorth.frm"];
			if(this.scrollStates.yNeg && this.scrollStates.xNeg)
				this.scrollimg = (this.scrollStates.yNegBlocked || this.scrollStates.xNegBlocked) ? _assets["art/intrface/scrnwx.frm"] : _assets["art/intrface/scrnwest.frm"];
			if(this.scrollStates.yNeg && this.scrollStates.xPos)
				this.scrollimg = (this.scrollStates.yNegBlocked || this.scrollStates.xPosBlocked) ? _assets["art/intrface/scrnex.frm"] : _assets["art/intrface/scrneast.frm"];
			if(this.scrollStates.yPos) this.scrollimg = (this.scrollStates.yPosBlocked) ? _assets["art/intrface/scrsx.frm"] : _assets["art/intrface/scrsouth.frm"];
			if(this.scrollStates.yPos && this.scrollStates.xNeg)
				this.scrollimg = (this.scrollStates.yPosBlocked || this.scrollStates.xNegBlocked) ? _assets["art/intrface/scrswx.frm"] : _assets["art/intrface/scrswest.frm"];
			if(this.scrollStates.yPos && this.scrollStates.xPos)
				this.scrollimg = (this.scrollStates.yPosBlocked || this.scrollStates.xNegBlocked) ? _assets["art/intrface/scrsex.frm"] : _assets["art/intrface/scrseast.frm"];

			blitFRM(this.scrollimg,
				_context,
				_mouse.x,
				_mouse.y);

		} else if(this.inputState == "interface") {		// if not scrolling

			blitFRM(_assets["art/intrface/stdarrow.frm"],
				_context,
				_mouse.x,
				_mouse.y);

		} else if(this.inputState == "game") {	// if not in HUD - on map
			switch(this.inputState_sub) {
				case "move":

					blitFRM(_assets["art/intrface/msef000.frm"],		// mouse overlay
						_context,
						this.hsIndex.x - this.camera.x - 1,
						this.hsIndex.y - this.camera.y - 1,
						0, 0, 0.5, "#900000");

					if(this.cIndex_path == 0) {		// render "X" if no path to location
						blitFontString(_assets["font1.aaf"],
							_context,
							"X",
							this.hsIndex.x - this.camera.x + 11,
							this.hsIndex.y - this.camera.y + 5,
							"#FF0000",
							"#000000");
					}

					break;
				case "command":
					blitFRM(_assets["art/intrface/actarrow.frm"],
						_context,
						_mouse.x,
						_mouse.y);

					if(this.cIndex_state) {
						blitFRM(_assets["art/intrface/lookn.frm"],
							_context,
							_mouse.x + 40,
							_mouse.y);
					}
					break;
			}	// end switch

		}
	};

	createMapObject(source) {

		let newObject;	// create objects

		if(source.objectTypeID == 1) {		// actor
			newObject = new Actor();

			newObject.objectID1 = String.fromCharCode(97 + source.objectID1);
			newObject.objectID2 = String.fromCharCode(97 + source.objectID2);
			newObject.objectID3 = source.objectID3;

			newObject.weapon = 0;
			newObject.armor = 0;

		} else {		// static

			switch(getObjectType(source.objectTypeID)) {
				case "items": 	// items

					newObject = new SpriteObject();

					switch(source.subtypeID) {
						case 0:		//armor
							newObject.armorMaleFID = source.armorMaleFID;
							newObject.armorFemaleFID = source.armorFemaleFID;
							break;
						case 3:		//weapons
							newObject.weaponAnimCode = source.animCode;
							break;
					}

					break;
				case "scenery":		//scenery
					switch(source.subtypeID) {
						case 0:		// door
							newObject = new SpriteObject_Door();
							newObject.objectType = "door";	// temp
							break;
						case 1:		// stairs
							newObject = new SpriteObject();
							break;
						case 2:		// elevator
							newObject = new SpriteObject();
							break;
						default:
							newObject = new SpriteObject();
							break;
					}
					break;
				case "misc":
					newObject = new SpriteObject();
						switch(source.objectID) {
							case 16:	// exit grids
							case 17:
							case 18:
							case 19:
							case 20:
							case 21:
							case 22:
							case 23:
								newObject.exitGrid_map = source.exitMap;
								newObject.exitGrid_pos = source.exitPosition;
								newObject.exitGrid_elev = source.exitElevation;
								newObject.exitGrid_orientation = source.exitOrientation;
								break;
							default:
								break;
						}

					break;

				default:
					newObject = new SpriteObject();
					break;

			}


			newObject.subtypeID = source.subtypeID;
		}


		newObject.itemFlags = source.itemFlags;
		newObject.PID = source.PID;
		newObject.objectTypeID = source.objectTypeID;
		newObject.objectID = source.objectID;

		newObject.FID = source.FID;
		newObject.frmTypeID = source.frmTypeID;
		newObject.frmID = source.frmID;

		newObject.textID = source.textID;


		newObject.inventory = new Array(source.inventorySize);
		for(let m = 0; m < source.inventorySize; m++) {
			newObject.inventory[m] = this.createMapObject(source.inventory[m]);
			if(newObject.inventory[m].objectTypeID == 0) {		// item
				switch(newObject.inventory[m].subtypeID) {
					case 0:		// armor
						if(newObject.inventory[m].itemFlags & 0x04000000) {
							newObject.armor = newObject.inventory[m];
						}
						break;
					case 3:		// weapon
						if(newObject.inventory[m].itemFlags & 0x01000000) {	// right hand
							newObject.slot1 = newObject.inventory[m];
						}

						if(newObject.inventory[m].itemFlags & 0x02000000) {	// left hand
							newObject.slot2 = newObject.inventory[m];
						}
						break;
					default:
						break;

				}
			}
		}

		newObject.hexPosition = source.hexPosition;
		newObject.orientation = source.orientation;

		newObject.anim.frameNumber = source.frameNumber;

		this.object_setAnim(newObject,"idle",newObject.anim.frameNumber);

		return newObject;

	};


	object_playAnim(obj = null, newAnim = "idle", frame = 0, actionFrame = 0, dir = 0, loop = false, actionCallback = null, endCallback = null) {
		// playAnim differs from setAnim in that behaviors can be set here, this calls setAnim where the img var is generated, and offsets computed.

		this.object_setAnim(obj, newAnim, frame, dir, loop, true);
		obj.anim.actionFrame = actionFrame;

		if(actionCallback == endCallback) {
			if(isFunction(actionCallback) && isFunction(endCallback)) this.actor_addAction(obj,actionCallback,"onActionFrame|onAnimEnd");
		} else {
			if(isFunction(actionCallback)) this.actor_addAction(obj,actionCallback,"onActionFrame");
			if(isFunction(endCallback)) this.actor_addAction(obj,endCallback,"onAnimEnd");
		}
	};


	object_setAnim(obj = null, newAnim = "idle", frame = 0, dir = 0, loop = false, active = false) {

		obj.anim.currentAnim = newAnim;
		obj.anim.animActive = active;
		obj.anim.animLoop = loop;
		obj.anim.animDirection = dir;
		obj.anim.actionFrame = 0;

		let generateFRMstring = function(object) {
			let frmID = obj.FID & 0x00000FFF;
			let filetype = getObjectType(obj.FID >> 24);

			if(filetype == "critters") {
				let weaponString = "a";
				let animString = "a";

				let frmBase = _assets["art/critters/critters.lst"][frmID].data.base;

				if(object.armorMaleFID || object.armorFemaleFID) {
					//frmBase = FIDtoFRM(object.armorMaleFID);		// @TODO:WTF
				}

				if(object.slot2) {	// ?
					weaponString = String.fromCharCode(99+object.slot2.weaponAnimCode);		// d-m
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

			let filename = _assets["art/" + filetype + "/" + filetype + ".lst"][frmID].data;
			return "art/" + filetype + "/" + filename;
		};


		obj.anim.img = _assets[generateFRMstring(obj)];		// Replace old GenerateFRMPtr
		this.object_setFrame(obj,frame);	// reset frame and offset

		if(obj.hasOwnProperty('ai') && newAnim == "idle") {		// idle
			obj.ai.idleStartTime = getTicks();
		}

	};

	object_setFrame(obj, frame = 0) {
		if(frame == -1) {
			frame = obj.anim.img.nFrames-1;	// last frame
		}

		obj.anim.frameNumber = frame;
		obj.anim.shiftX = obj.anim.img.shift[obj.orientation].x;
		obj.anim.shiftY = obj.anim.img.shift[obj.orientation].y;

		if(!obj.anim.img.frameInfo[obj.orientation]) {
			console.log("MainState: object_setFrame: Orientation error");
			obj.orientation = 0;
			return;
		}

		for(let f = 0; f < obj.anim.frameNumber+1; f++) {	// set offsets
			obj.anim.shiftX += obj.anim.img.frameInfo[obj.orientation][f].offsetX;
			obj.anim.shiftY += obj.anim.img.frameInfo[obj.orientation][f].offsetY;
		}

	};

	actor_beginMoveState(actor, dest, runState, pathCompleteCallback) {
		if(actor.ai.moveState) {		// if already in anim

			this.actor_addActionToFront(actor, () => {
				this.actor_moveStep(actor);
				this.actor_endMoveState(actor);
				this.actor_cancelAction(actor);
				this.actor_beginMoveState(actor,dest,this.inputRunState);
			}, "onAnimEnd|onActionFrame");

			return;
		}

		actor.ai.pathQ = this.findPath(actor.hexPosition,dest);
		if(!actor.ai.pathQ) return;

		actor.ai.moveState = true;
		actor.ai.runState = runState;
		actor.ai.moveDest = dest;

		actor.ai.moveNext = actor.ai.pathQ.shift();
		actor.orientation = mapGeometry.findOrientation(actor.hexPosition,actor.ai.moveNext);

		if(actor.ai.runState) {	// run
			this.object_playAnim(actor,"run",0,2,0,true);
		} else {	// walk
			this.object_playAnim(actor,"walk",0,4,0,true);
		}

		this.actor_addActionToFront(actor,
			this.actor_moveStep.bind(this, actor),
			"onAnimEnd|onActionFrame");

	};


	actor_moveStep(actor) {
		actor.hexPosition = actor.ai.moveNext;

		if(actor.hexPosition == actor.ai.moveDest) {		// destination reached
			this.actor_endMoveState(actor);
			return;
		}

		actor.ai.moveNext = actor.ai.pathQ.shift();
		actor.orientation = mapGeometry.findOrientation(actor.hexPosition,actor.ai.moveNext);

		actor.anim.shiftX = actor.anim.img.shift[actor.orientation].x;
		actor.anim.shiftY = actor.anim.img.shift[actor.orientation].y;

		if(actor.ai.runState) {
			switch(actor.anim.actionFrame) {
				case 2:
					actor.anim.actionFrame = 4;
					break;
				case 4:
					actor.anim.actionFrame = 6;
					break;
				case 6:
					actor.anim.actionFrame = 8;
					break;
				case 8:
					actor.anim.actionFrame = 10;	// never reached, anim resets before this point.
					break;
				case 10:		// this will be reset on animation end
					actor.anim.actionFrame = 2;
					break;
			}
		}

		this.actor_addActionToFront(actor,
			this.actor_moveStep.bind(this, actor),
			"onAnimEnd|onActionFrame");


		if(actor == this.player) {
			if(this.map.hexMap[actor.currentElevation][actor.hexPosition].exitGrid) {		// exit map
				this.exitMap(this.map.hexMap[actor.currentElevation][actor.hexPosition].exitGrid_map,
					this.map.hexMap[actor.currentElevation][actor.hexPosition].exitGrid_pos,
					this.map.hexMap[actor.currentElevation][actor.hexPosition].exitGrid_elev,
					this.map.hexMap[actor.currentElevation][actor.hexPosition].exitGrid_orientation);
			}
		}

	};

	actor_endMoveState(actor) {
		if(!actor.ai.moveState) return;
		actor.ai.moveState = false;

		this.object_setAnim(actor,"idle",0,0,false,false);
		actor.anim.actionFrameCallback = 0;
		actor.anim.animEndCallback = 0;

		this.actor_nextAction(actor,"endMoveState");
	};


	actor_addAction(actor,action,trigger,delay) {
		if(isFunction(action)) {
			actor.actionQ.push({
				trigger: trigger,
				action: action,
				timeStart: getTicks(),
				delay: delay,
			});
		}
	};

	actor_addActionToFront(actor,action,trigger,delay) {
		if(isFunction(action)) {
			actor.actionQ.unshift({
				trigger: trigger,
				action: action,
				timeStart: getTicks(),
				delay: delay,
			});
		}
	};

	actor_checkTimedAction(actor) {
		if(!actor.actionQ.length) return false;

		actionTriggers = actor.actionQ[0].trigger.split("|");	// allow logical OR
		for(let i = 0; i < actionTriggers.length; i++) {
			if(actionTriggers[i] == "timed") {

				let currentTime = getTicks();
				let endTime = actor.actionQ[0].timeStart + (actor.actionQ[0].delay*1000);

				if(currentTime > endTime) {
					let nextAction = actor.actionQ.shift();
					nextAction.action.call(this);
					return true;
				}

			}
		}
		return false;
	}

	actor_nextAction(actor, trigger) {
		if(!actor.actionQ.length) return false;

		let actionTriggers = actor.actionQ[0].trigger.split("|");	// allow logical OR
		for(let i = 0; i < actionTriggers.length; i++) {
			if(actionTriggers[i] == trigger) {
				let nextAction = actor.actionQ.shift();
				nextAction.action.call(this);
				return true;
			}
		}
		return false;

	};

	actor_cancelAction(actor) {
		actor.actionQ = [];
	};


	object_openDoor(obj) {
		this.object_playAnim(obj,0,0,0,0,false,0, () => {
			obj.openState = 1;
			this.map.hexMap[this.player.currentElevation][obj.hexPosition].blocked = false;	// FIX FOR ELEVATION
		});
	};

	object_closeDoor(obj) {
		this.object_playAnim(obj,0,-1,0,1,false,0, () => {
			obj.openState = 0;
			this.map.hexMap[this.player.currentElevation][obj.hexPosition].blocked = true;	// FIX FOR ELEVATION
		});

	};

};
