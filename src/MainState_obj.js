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
	
	obj.anim.img = this.generateFRMstring(obj);	
	this.object_setFrame(obj,frame);	// reset frame and offset
		
	
	
};

MainState.prototype.object_setFrame = function(obj,frame) {
	if(!frame) frame = 0;
	if(frame == -1) {
		frame = _assets[obj.anim.img].nFrames-1;	// last frame
		return;		// bug lies here
	}
	
	obj.anim.frameNumber = frame;	
	obj.anim.shiftX = _assets[obj.anim.img].shift[obj.orientation].x;
	obj.anim.shiftY = _assets[obj.anim.img].shift[obj.orientation].y;
	
	for(var f = 0; f < obj.anim.frameNumber; f++) {	// set offsets
		obj.anim.shiftX += _assets[obj.anim.img].frameInfo[obj.orientation][f].offsetX;
		obj.anim.shiftY += _assets[obj.anim.img].frameInfo[obj.orientation][f].offsetY;
	}
	
};

MainState.prototype.actor_beginMoveState = function(actor, dest, runState, pathCompleteCallback) {
	var mState = this;

	if(actor.ai.moveState) {		// if already in anim
		var newMoveState = function() {
			mState.actor_moveStep(actor);
			mState.actor_endMoveState(actor);
			mState.actor_beginMoveState(actor,dest,mState.inputRunState);			
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
	
	if(isFunction(pathCompleteCallback)) {
		actor.anim.moveEndCallback = pathCompleteCallback;
	} else {
		actor.anim.moveEndCallback = 0;
	}
	
	var callback = function() {
		mState.actor_moveStep(actor);
	};

	if(actor.ai.runState) {	// run
		this.object_playAnim(actor,"run",0,2,0,true,callback,callback);
	} else {	// walk
		this.object_playAnim(actor,"walk",0,4,0,true,callback,callback);
	}
};


MainState.prototype.actor_moveStep = function(actor) {
	var mState = this;
	actor.hexPosition = actor.ai.moveNext;

	if(actor.hexPosition == actor.ai.moveDest) {		// destination reached
		this.actor_endMoveState(actor);		
		if(isFunction(actor.anim.moveEndCallback)) {	// moveEndCallback
			var cb = actor.anim.moveEndCallback;
			cb.call(actor);
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

MainState.prototype.actor_endMoveState = function(actor) {
	if(!actor.ai.moveState) return;
	actor.ai.moveState = false;

	this.object_setAnim(actor,"idle",0,0,false,false);
	actor.anim.actionFrameCallback = 0;
	actor.anim.animEndCallback = 0;

};


MainState.prototype.object_openDoor = function(obj) {
	var mState = this;
	mState.object_playAnim(obj,0,0,0,0,false,0,function() {
		obj.openState = 1;
		mState.map.hexMap[mState.player.currentElevation][obj.hexPosition].blocked = false;	// FIX FOR ELEVATION
	});
};

MainState.prototype.object_closeDoor = function(obj) {		// BUGGED
	//MainState.prototype.object_playAnim = function(obj, newAnim, frame, actionFrame, dir, loop, actionCallback, endCallback) {
	var mState = this;		
	mState.object_playAnim(obj,0,-1,0,1,false,0,function() {
		obj.openState = 0;
		mState.map.hexMap[mState.player.currentElevation][obj.hexPosition].blocked = true;	// FIX FOR ELEVATION
	});
	
};
