mainState.prototype.createMapObject = function(source) {

	var newObject;	// create objects

	if(source.objectTypeID == 1) {		// actor
		newObject = new Actor();

		newObject.objectID1 = String.fromCharCode(97 + source.objectID1);
		newObject.objectID2 = String.fromCharCode(97 + source.objectID2);
		newObject.objectID3 = source.objectID3;

		newObject.weapon = 0;
		newObject.armor = 0;

	} else {		// static
		
		switch(source.objectTypeID) {
			case 0: 	// items
			
				newObject = new SpriteObject();
				
				switch(source.subtypeID) {			
					
				}
				
				break;
			case 2:		//scenery
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
				
			default:
				newObject = new SpriteObject();
				break;
		} 
		

		
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
						newObject.rightHand = newObject.inventory[m];
					}

					if(newObject.inventory[m].itemFlags & 0x02000000) {	// left hand
						newObject.leftHand = newObject.inventory[m];
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

	this.object_setAnim(newObject,"idle");

	return newObject;

};

mainState.prototype.object_playAnim = function(obj, newAnim, actionFrame, dir, loop, actionCallback, endCallback) {
	
	if(!dir) dir = 0;
	if(!newAnim) newAnim = "idle";
	if(!actionFrame) actionFrame = 0;
	if(!loop) loop = false;
	
	this.object_setAnim(obj, newAnim);
	
	obj.anim.animDirection = dir;
	obj.anim.actionFrame = actionFrame;
	
	obj.anim.animDirection = dir;
	obj.anim.animLoop = loop;
	
	obj.anim.animActive = true;
	
	if(isFunction(actionCallback)) {
		obj.anim.actionFrameCallback = actionCallback;
	} else {
		obj.anim.actionFrameCallback = 0;
	}
	
	if(isFunction(endCallback)) {
		obj.anim.animEndCallback = endCallback;
	} else {
		obj.anim.animEndCallback = 0;
	}
	
};


mainState.prototype.object_setAnim = function(obj, newAnim, frame, dir) {
	if(!frame) frame = 0;
	if(!dir) dir = 0;
	if(!newAnim) newAnim = "idle";
	
	obj.anim.currentAnim = newAnim;
	obj.anim.animDirection = dir;
	obj.anim.actionFrame = 0;
	
	
	obj.anim.img = this.generateFRMstring(obj);	
	this.object_setFrame(obj,frame);	// reset frame and offset
	
};

mainState.prototype.object_setFrame = function(obj,frame) {
	if(!frame) frame = 0;
	if(frame == -1) frame = _assets[obj.anim.img].nFrames-1;	// last frame
	
	obj.anim.frameNumber = frame;
	obj.anim.shiftX = _assets[obj.anim.img].shift[obj.orientation].x;
	obj.anim.shiftY = _assets[obj.anim.img].shift[obj.orientation].y;
	
	if(frame > 0) {
		for(var f = 0; f < frame; f++) {
			obj.anim.shiftX += _assets[obj.anim.img].frameInfo[obj.orientation][f].offsetX;
			obj.anim.shiftY += _assets[obj.anim.img].frameInfo[obj.orientation][f].offsetY;			
		}
	}
	
};

mainState.prototype.actor_beginMoveState = function(actor,dest,runState,complete) {
	var mState = this;
	actor.anim.animLoop = true;	
	
	if(actor.ai.moveState) {		// if already in anim
		var newMoveState = function() {
			mState.actor_moveStep(actor);
			mState.actor_endMoveState(actor);
			mState.actor_beginMoveState(actor,dest,this.inputRunState);			
		};
		
		actor.anim.actionFrameCallback = newMoveState;
		actor.anim.animEndCallback = newMoveState;

		return;
	}
	
	actor.ai.pathQ = mState.findPath(actor.hexPosition,dest);
	if(!actor.ai.pathQ) return;

	actor.ai.moveState = true;
	actor.ai.runState = runState;
	actor.ai.moveDest = dest;

	actor.ai.moveNext = actor.ai.pathQ.shift();
	actor.orientation = this.mapGeometry.findOrientation(actor.hexPosition,actor.ai.moveNext);
	
	actor.anim.frameNumber = 0;
	actor.anim.animActive = true;
	
	if(isFunction(complete)) {
		actor.anim.moveEndCallback = complete;
	} else {
		actor.anim.moveEndCallback = 0;
	}
	
	var callback = function() {
		mState.actor_moveStep(actor);
	};
	
	actor.anim.actionFrameCallback = callback;
	actor.anim.animEndCallback = callback;

	if(actor.ai.runState) {
		this.object_setAnim(actor,"run");
		actor.anim.actionFrame = 2;
	} else {
		this.object_setAnim(actor,"walk");
		actor.anim.actionFrame = 4;
	}
};


mainState.prototype.actor_moveStep = function(actor) {
	var mState = this;
	actor.hexPosition = actor.ai.moveNext;

	if(actor.hexPosition == actor.ai.moveDest) {		// destination reached
		this.actor_endMoveState(actor);		
		if(isFunction(actor.anim.moveEndCallback)) {	// moveEndCallback
			var cb = actor.anim.moveEndCallback;
			cb();
			actor.anim.moveEndCallback = 0;
		}
		return;
	}

	actor.ai.moveNext = actor.ai.pathQ.shift();
	actor.orientation = this.mapGeometry.findOrientation(actor.hexPosition,actor.ai.moveNext);
	
	actor.anim.shiftX = _assets[actor.anim.img].shift[actor.orientation].x;
	actor.anim.shiftY = _assets[actor.anim.img].shift[actor.orientation].y;

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

	actor.anim.actionFrameCallback = moveStep;
	actor.anim.animEndCallback = moveStep;
};

mainState.prototype.actor_endMoveState = function(actor) {
	if(!actor.ai.moveState) return;

	actor.ai.moveState = false;

	this.object_setAnim(actor,"idle");
	actor.anim.animActive = false;
	actor.anim.animLoop = false;
	actor.anim.actionFrameCallback = 0;
	actor.anim.animEndCallback = 0;

};



mainState.prototype.object_openDoor = function(obj) {
	var mState = this;
	this.object_setFrame(obj,0);	// reset
	obj.anim.animActive = true;
	obj.anim.animLoop = false;
	obj.anim.animDirection = 0;
	
	obj.anim.animEndCallback = function() {
		obj.openState = 1;
		mState.map.hexMap[0][obj.hexPosition].blocked = false;	// FIX FOR ELEVATION
	}
};

mainState.prototype.object_closeDoor = function(obj) {
	var mState = this;
	this.object_setFrame(obj,-1);	// reset
	obj.anim.animActive = true;
	obj.anim.animLoop = false;
	obj.anim.animDirection = 1;
	
	obj.anim.animEndCallback = function() {
		obj.openState = 0;
		mState.map.hexMap[0][obj.hexPosition].blocked = true;	// FIX FOR ELEVATION
	}
};
