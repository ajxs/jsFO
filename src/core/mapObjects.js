'use strict';

class SpriteObject {
	constructor() {
		this.orientation = 0;
		this.hexPosition = 0;

		this.actionQ = [];

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

			animLoop : false,
			animDirection : 0,	// forward

		}
	};
};

class SpriteObject_Door extends SpriteObject {	//@TODO: FIX
	constructor() {
		super();
		this.locked = false;
		this.key = 0;
		this.openState = 0;
	};
};

class Actor extends SpriteObject {
	constructor() {
		super();

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
			idleStartTime: 0,
		};
	};
};
