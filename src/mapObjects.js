function Actor() {
	SpriteObject.call(this);

	this.runState = false;
	this.moveState = false;
	this.moveDest = 0;
	this.nextMove = 0;
	
	this.ai = {
		moveState: false,
		runState: false,
		
		moveDest: 0,
		moveNext: 0,
		
		pathQ: 0,

	};
	
}


Actor.prototype = new SpriteObject();
Actor.prototype.constructor = Actor;

Actor.prototype.runState = false;
Actor.prototype.moveState = false;
Actor.prototype.moveDest = 0;
Actor.prototype.nextMove = 0;




function SpriteObject() {		// REMEMBER TO INIT EVERYTHING
	
	this.orientation = 0;
	this.hexPosition = 0;
	
	this.PID = 0,
	this.objectTypeID = 0,
	this.objectID = 0,
	this.objectID1 = 0,
	this.objectID2 = 0,
	this.objectID3 = 0,
	
	this.FID = 0,
	
	this.frmID = 0,
	this.frmTypeID = 0,
	
	this.anim = {
		img: 0,
		currentAnim: 0,
		
		animActive: false,	
		frameNumber: 0,
		animDelta: 0,
		lastFrameTime: 0,
		actionFrame: 0,
		
		actionFrameCallback: 0,
		animEndCallback: 0,
		moveEndCallback: 0,
		
		shiftX: 0,
		shiftY: 0,
		
		animLoop : true,
		animDirection : 0,	// forward
		
	}
	
}


SpriteObject.prototype = {
	constructor: SpriteObject,

	orientation: 0,
	hexPosition: 0,
	
	PID: 0,
	objectTypeID: 0,
	objectID: 0,
	
	FID: 0,
	
	frmID: 0,
	frmTypeID: 0,
	
	img: 0,

	anim: {
		img: 0,
		currentAnim: 0,
		
		animActive: false,	
		frameNumber: 0,
		animDelta: 0,
		lastFrameTime: 0,
		actionFrame: 0,
		
		shiftX: 0,
		shiftY: 0,
	},
	
}


function SpriteObject_Door() {
	SpriteObject.call(this);
	
	this.locked = false;
	this.key = 0;
	this.openState = 0;
	
}

SpriteObject_Door.prototype = new SpriteObject();
SpriteObject_Door.prototype.constructor = SpriteObject_Door;

