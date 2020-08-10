"use strict";

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

		this.skills = {
			"Small Guns": {
				level: 0,
				tagged: 0,
			},
			"Big Guns": {
				level: 0,
				tagged: 0,
			},
			"Energy Weapons": {
				level: 0,
				tagged: 0,
			},
			"Unarmed": {
				level: 0,
				tagged: 0,
			},
			"Melee Weapons": {
				level: 0,
				tagged: 0,
			},
			"Throwing": {
				level: 0,
				tagged: 0,
			},
			"First Aid": {
				level: 0,
				tagged: 0,
			},
			"Doctor": {
				level: 0,
				tagged: 0,
			},
			"Sneak": {
				level: 0,
				tagged: 0,
			},
			"Lockpick": {
				level: 0,
				tagged: 0,
			},
			"Steal": {
				level: 0,
				tagged: 0,
			},
			"Traps": {
				level: 0,
				tagged: 0,
			},
			"Science": {
				level: 0,
				tagged: 0,
			},
			"Repair": {
				level: 0,
				tagged: 0,
			},
			"Speech": {
				level: 0,
				tagged: 0,
			},
			"Barter": {
				level: 0,
				tagged: 0,
			},
			"Gambling": {
				level: 0,
				tagged: 0,
			},
			"Outdoorsman": {
				level: 0,
				tagged: 0,
			}

		};

		this.stats = {
			"armorClass": {
				level: 1,
			},
			"actionPoints": {
				level: 1,
			},
			"carryWeight": {
				level: 1,
			},
			"meleeDamage": {
				level: 1,
			},
			"damageRes": {
				level: 1,
			},
			"poisonRes": {
				level: 1,
			},
			"radiationRes": {
				level: 1,
			},
			"sequence": {
				level: 1,
			},
			"healingRate": {
				level: 1,
			},
			"criticalChance": {
				level: 1,
			}
		};

	};

};
