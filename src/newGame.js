var newGame = {
	map: "geckpwpl.map",
	//map: "mbclose.map",
	playerStartPos: "default",
	playerStartOrientation: "default",
	playerStartElevation: "default",
	
	player: 0,	// populate this on game init
	
};


newGame.player = new Actor();
newGame.player.PID = 0;
newGame.player.objectTypeID = 1;
newGame.player.objectID = 0;

newGame.player.name = "Anthony";
newGame.player.age = 28;
newGame.player.sex = "male";

newGame.player.FID = 16777227;		// hmjmpsaa
newGame.player.frmTypeID = 0;
newGame.player.frmID = 0;	

newGame.player.skills = {
	
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
	},
	
	
};

newGame.player.stats = {
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
	},
}