MainState.prototype.createMapObject = function(source) {

	var newObject;	// create objects

	if(source.objectTypeID == 1) {		// actor
		newObject = new Actor();

		newObject.objectID1 = String.fromCharCode(97 + source.objectID1);
		newObject.objectID2 = String.fromCharCode(97 + source.objectID2);
		newObject.objectID3 = source.objectID3;

		newObject.weapon = 0;
		newObject.armor = 0;

	} else {		// static
	
		switch(this.getObjectType(source.objectTypeID)) {
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
	for(var m = 0; m < source.inventorySize; m++) {
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


MainState.prototype.object_playAnim = function(obj, newAnim, frame, actionFrame, dir, loop, actionCallback, endCallback) {
	// playAnim differs from setAnim in that behaviors can be set here, this calls setAnim where the img var is generated, and offsets computed.
	if(!dir) dir = 0;
	if(!newAnim) newAnim = "idle";
	if(!actionFrame) actionFrame = 0;
	if(!frame) {
		frame = 0;
	}
	if(!loop) loop = false;
	
	this.object_setAnim(obj, newAnim, frame, dir, loop, true);

	obj.anim.actionFrame = actionFrame;
	
	if(actionCallback == endCallback) {
		if(isFunction(actionCallback) && isFunction(endCallback)) this.actor_addAction(obj,actionCallback,"onActionFrame|onAnimEnd");		
	} else {
		if(isFunction(actionCallback)) this.actor_addAction(obj,actionCallback,"onActionFrame");
		if(isFunction(endCallback)) this.actor_addAction(obj,endCallback,"onAnimEnd");
	}
	
};


MainState.prototype.object_setAnim = function(obj, newAnim, frame, dir, loop, active) {
	if(!frame) {
		frame = 0;
	}
	if(!dir) dir = 0;
	if(!newAnim) newAnim = "idle";
	if(!loop) loop = false;
	if(!active) active = false;

	obj.anim.currentAnim = newAnim;
	obj.anim.animActive = active;
	obj.anim.animLoop = loop;
	obj.anim.animDirection = dir;
	obj.anim.actionFrame = 0;

	obj.anim.img = this.generateFRMptr(obj);
	this.object_setFrame(obj,frame);	// reset frame and offset
	
	if(obj.hasOwnProperty('ai') && newAnim == "idle") {		// idle
		obj.ai.idleStartTime = getTicks();
	}
		
};

MainState.prototype.object_setFrame = function(obj,frame) {
	if(!frame) frame = 0;
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
	
	for(var f = 0; f < obj.anim.frameNumber+1; f++) {	// set offsets
		obj.anim.shiftX += obj.anim.img.frameInfo[obj.orientation][f].offsetX;
		obj.anim.shiftY += obj.anim.img.frameInfo[obj.orientation][f].offsetY;
	}
	
};

MainState.prototype.actor_beginMoveState = function(actor, dest, runState, pathCompleteCallback) {
	var mState = this;

	if(actor.ai.moveState) {		// if already in anim
		var newMoveState = function() {
			mState.actor_moveStep(actor);
			mState.actor_endMoveState(actor);
			mState.actor_cancelAction(actor);
			mState.actor_beginMoveState(actor,dest,mState.inputRunState);			
		}
		
		mState.actor_addActionToFront(actor,newMoveState,"onAnimEnd|onActionFrame");
		
		
		return;
	}
	
	actor.ai.pathQ = mState.findPath(actor.hexPosition,dest);
	if(!actor.ai.pathQ) return;

	actor.ai.moveState = true;
	actor.ai.runState = runState;
	actor.ai.moveDest = dest;

	actor.ai.moveNext = actor.ai.pathQ.shift();
	actor.orientation = this.mapGeometry.findOrientation(actor.hexPosition,actor.ai.moveNext);
	
	
	var moveStep = function() {
		mState.actor_moveStep(actor);
	};

	if(actor.ai.runState) {	// run
		this.object_playAnim(actor,"run",0,2,0,true);
	} else {	// walk
		this.object_playAnim(actor,"walk",0,4,0,true);
	}
	
	mState.actor_addActionToFront(actor,moveStep,"onAnimEnd|onActionFrame");
	
};


MainState.prototype.actor_moveStep = function(actor) {
	var mState = this;
	actor.hexPosition = actor.ai.moveNext;

	if(actor.hexPosition == actor.ai.moveDest) {		// destination reached
		this.actor_endMoveState(actor);		
		return;
	}

	actor.ai.moveNext = actor.ai.pathQ.shift();
	actor.orientation = this.mapGeometry.findOrientation(actor.hexPosition,actor.ai.moveNext);
	
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
	
	var moveStep = function() {
		mState.actor_moveStep(actor);
	};

	mState.actor_addActionToFront(actor,moveStep,"onAnimEnd|onActionFrame");
	
	
	if(actor == mState.player) {
		if(mState.map.hexMap[actor.currentElevation][actor.hexPosition].exitGrid) {		// exit map
			mState.exitMap(mState.map.hexMap[actor.currentElevation][actor.hexPosition].exitGrid_map,
				mState.map.hexMap[actor.currentElevation][actor.hexPosition].exitGrid_pos,
				mState.map.hexMap[actor.currentElevation][actor.hexPosition].exitGrid_elev,
				mState.map.hexMap[actor.currentElevation][actor.hexPosition].exitGrid_orientation);
		}
	}
	
};

MainState.prototype.actor_endMoveState = function(actor) {
	if(!actor.ai.moveState) return;
	actor.ai.moveState = false;

	this.object_setAnim(actor,"idle",0,0,false,false);
	actor.anim.actionFrameCallback = 0;
	actor.anim.animEndCallback = 0;
	
	this.actor_nextAction(actor,"endMoveState");
};


MainState.prototype.actor_addAction = function(actor,action,trigger,delay) {
	if(isFunction(action)) {
		actor.actionQ.push({
			trigger: trigger,
			action: action,
			timeStart: getTicks(),
			delay: delay,
		});
	}
};

MainState.prototype.actor_addActionToFront = function(actor,action,trigger,delay) {
	if(isFunction(action)) {
		actor.actionQ.unshift({
			trigger: trigger,
			action: action,
			timeStart: getTicks(),
			delay: delay,
		});
	}
};

MainState.prototype.actor_checkTimedAction = function(actor) {
	if(!actor.actionQ.length) return false;
	
	actionTriggers = actor.actionQ[0].trigger.split("|");	// allow logical OR
	for(var i = 0; i < actionTriggers.length; i++) {
		if(actionTriggers[i] == "timed") {
			
			var currentTime = getTicks();
			var endTime = actor.actionQ[0].timeStart + (actor.actionQ[0].delay*1000);
			
			if(currentTime > endTime) {
				var nextAction = actor.actionQ.shift();
				nextAction.action.call(this);
				return true;			
			}
				
		}		
	}
	return false;
	
}

MainState.prototype.actor_nextAction = function(actor, trigger) {
	if(!actor.actionQ.length) return false;
	
	actionTriggers = actor.actionQ[0].trigger.split("|");	// allow logical OR
	for(var i = 0; i < actionTriggers.length; i++) {
		if(actionTriggers[i] == trigger) {
			var nextAction = actor.actionQ.shift();
			nextAction.action.call(this);
			return true;			
		}		
	}
	return false;

};

MainState.prototype.actor_cancelAction = function(actor) {
	actor.actionQ = [];	
};


MainState.prototype.object_openDoor = function(obj) {
	var mState = this;
	mState.object_playAnim(obj,0,0,0,0,false,0,function() {
		obj.openState = 1;
		mState.map.hexMap[mState.player.currentElevation][obj.hexPosition].blocked = false;	// FIX FOR ELEVATION
	});
};

MainState.prototype.object_closeDoor = function(obj) {
	var mState = this;		
	mState.object_playAnim(obj,0,-1,0,1,false,0,function() {
		obj.openState = 0;
		mState.map.hexMap[mState.player.currentElevation][obj.hexPosition].blocked = true;	// FIX FOR ELEVATION
	});
	
};
