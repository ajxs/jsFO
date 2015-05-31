"use strict";

function CharacterScreenState() {
	GameState.call(this);
}

CharacterScreenState.prototype = new GameState();
CharacterScreenState.prototype.constructor = CharacterScreenState;

CharacterScreenState.prototype.activeItem = -1;
CharacterScreenState.prototype.mouseState = -1;
CharacterScreenState.prototype.activeMenu = -1;
CharacterScreenState.prototype.selectedItem = -1;


CharacterScreenState.prototype.activeTab = "perks";
CharacterScreenState.prototype.skillImage = "art/skilldex/morecrit.frm";



CharacterScreenState.prototype.x = 0;
CharacterScreenState.prototype.y = 0;

CharacterScreenState.prototype.slider = {
	x: 592, y: 16,
	width: 43, height: 29,	
};


CharacterScreenState.prototype.cancelButton = {
	x: 553, y: 454,
	width: 15, height: 16,
};

CharacterScreenState.prototype.doneButton = {
	x: 456, y: 454,
	width: 15, height: 16,
};

CharacterScreenState.prototype.printButton = {
	x: 344, y: 454,
	width: 15, height: 16,
};


CharacterScreenState.prototype.perksTab = {
	x: 11, y: 327,
	width: 96, height: 25,
};

CharacterScreenState.prototype.karmaTab = {
	x: 107, y: 327,
	width: 96, height: 25,
};

CharacterScreenState.prototype.killsTab = {
	x: 204, y: 327,
	width: 96, height: 25,
};

	
CharacterScreenState.prototype.smallGunsButton = {
	x: 380, y: 27,
	width: 100, height: 11,	
};
CharacterScreenState.prototype.bigGunsButton = {
	x: 380, y: 38,
	width: 100, height: 11,	
};
CharacterScreenState.prototype.energyWeaponsButton = {
	x: 380, y: 49,
	width: 100, height: 11,	
};
CharacterScreenState.prototype.unarmedButton = {
	x: 380, y: 60,
	width: 100, height: 11,	
};
CharacterScreenState.prototype.meleeWeaponsButton = {
	x: 380, y: 71,
	width: 100, height: 11,	
};
CharacterScreenState.prototype.throwingButton = {
	x: 380, y: 82,
	width: 100, height: 11,	
};
CharacterScreenState.prototype.firstAidButton = {
	x: 380, y: 93,
	width: 100, height: 11,	
};
CharacterScreenState.prototype.doctorButton = {
	x: 380, y: 104,
	width: 100, height: 11,	
};
CharacterScreenState.prototype.sneakButton = {
	x: 380, y: 115,
	width: 100, height: 11,	
};
CharacterScreenState.prototype.lockpickButton = {
	x: 380, y: 126,
	width: 100, height: 11,	
};
CharacterScreenState.prototype.stealButton = {
	x: 380, y: 137,
	width: 100, height: 11,	
};
CharacterScreenState.prototype.trapsButton = {
	x: 380, y: 148,
	width: 100, height: 11,	
};
CharacterScreenState.prototype.scienceButton = {
	x: 380, y: 159,
	width: 100, height: 11,	
};
CharacterScreenState.prototype.repairButton = {
	x: 380, y: 170,
	width: 100, height: 11,	
};
CharacterScreenState.prototype.speechButton = {
	x: 380, y: 181,
	width: 100, height: 11,	
};
CharacterScreenState.prototype.barterButton = {
	x: 380, y: 192,
	width: 100, height: 11,	
};
CharacterScreenState.prototype.gamblingButton = {
	x: 380, y: 203,
	width: 100, height: 11,	
};
CharacterScreenState.prototype.outdoorsmanButton = {
	x: 380, y: 214,
	width: 100, height: 11,	
};




CharacterScreenState.prototype.input = function(e) {
	switch(e.type) {
		case "mousemove":
			break;
		case "keydown":
			break;
		case "mousedown":
			this.mouseState = 1;
			break;
		case "mouseup":
			this.mouseState = 0;
			break;
		case "click":
			switch(this.activeItem) {
				case "printButton":
					this.activeItem = -1;	// reset this so that it mouse event doesn't propagate through on reopen
					break;
				case "doneButton":
					main_closeCharacterScreen();
					this.activeItem = -1;	// reset this so that it mouse event doesn't propagate through on reopen
					break;
				case "cancelButton":
					main_closeCharacterScreen();
					this.activeItem = -1;	// reset this so that it mouse event doesn't propagate through on reopen
					break;
				case "perksTab":
					this.activeTab = "perks";
					break;
				case "karmaTab":
					this.activeTab = "karma";
					break;
				case "killsTab":
					this.activeTab = "kills";
					break;

				case "smallGunsButton":
					this.selectedItem = "smallGunsButton";
					this.slider.y = this.smallGunsButton.y - 11;
					break;
				case "bigGunsButton":
					this.selectedItem = "bigGunsButton";
					this.slider.y = this.bigGunsButton.y - 11;
					break;
				case "energyWeaponsButton":
					this.selectedItem = "energyWeaponsButton";
					this.slider.y = this.energyWeaponsButton.y - 11;
					break;
				case "unarmedButton":
					this.selectedItem = "unarmedButton";
					this.slider.y = this.unarmedButton.y - 11;
					break;
				case "meleeWeaponsButton":
					this.selectedItem = "meleeWeaponsButton";
					this.slider.y = this.meleeWeaponsButton.y - 11;
					break;
				case "throwingButton":
					this.selectedItem = "throwingButton";
					this.slider.y = this.throwingButton.y - 11;
					break;
				case "firstAidButton":
					this.selectedItem = "firstAidButton";
					this.slider.y = this.firstAidButton.y - 11;
					break;
				case "doctorButton":
					this.selectedItem = "doctorButton";
					this.slider.y = this.doctorButton.y - 11;
					break;
				case "sneakButton":
					this.selectedItem = "sneakButton";
					this.slider.y = this.sneakButton.y - 11;
					break;
				case "lockpickButton":
					this.selectedItem = "lockpickButton";
					this.slider.y = this.lockpickButton.y - 11;
					break;
				case "stealButton":
					this.selectedItem = "stealButton";
					this.slider.y = this.stealButton.y - 11;
					break;
				case "trapsButton":
					this.selectedItem = "trapsButton";
					this.slider.y = this.trapsButton.y - 11;
					break;
				case "scienceButton":
					this.selectedItem = "scienceButton";
					this.slider.y = this.scienceButton.y - 11;
					break;
				case "repairButton":
					this.selectedItem = "repairButton";
					this.slider.y = this.repairButton.y - 11;
					break;
				case "speechButton":
					this.selectedItem = "speechButton";
					this.slider.y = this.speechButton.y - 11;
					break;
				case "barterButton":
					this.selectedItem = "barterButton";
					this.slider.y = this.barterButton.y - 11;
					break;
				case "gamblingButton":
					this.selectedItem = "gamblingButton";
					this.slider.y = this.gamblingButton.y - 11;
					break;
				case "outdoorsmanButton":
					this.selectedItem = "outdoorsmanButton";
					this.slider.y = this.outdoorsmanButton.y - 11;
					break;
					
			}
			break;
		case 'contextmenu':	// switch input modes on mouse2
			break;
	};	
};

CharacterScreenState.prototype.update = function() {
	
	this.activeItem = -1;	
	if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.printButton.x, this.printButton.y,
		this.printButton.width, this.printButton.height)) {
			this.activeItem = "printButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.cancelButton.x, this.cancelButton.y,
		this.cancelButton.width, this.cancelButton.height)) {
			this.activeItem = "cancelButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.doneButton.x, this.doneButton.y,
		this.doneButton.width, this.doneButton.height)) {
			this.activeItem = "doneButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.perksTab.x, this.perksTab.y,
		this.perksTab.width, this.perksTab.height)) {
			this.activeItem = "perksTab";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.karmaTab.x, this.karmaTab.y,
		this.karmaTab.width, this.karmaTab.height)) {
			this.activeItem = "karmaTab";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.killsTab.x, this.killsTab.y,
		this.killsTab.width, this.killsTab.height)) {
			this.activeItem = "killsTab";
	}
	
	if(intersectTest(_mouse.x,_mouse.y,0,0,		// check skills. ha
		this.smallGunsButton.x, this.smallGunsButton.y,
		this.smallGunsButton.width, this.smallGunsButton.height)) {
			this.activeItem = "smallGunsButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.bigGunsButton.x, this.bigGunsButton.y,
		this.bigGunsButton.width, this.bigGunsButton.height)) {
			this.activeItem = "bigGunsButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.energyWeaponsButton.x, this.energyWeaponsButton.y,
		this.energyWeaponsButton.width, this.energyWeaponsButton.height)) {
			this.activeItem = "energyWeaponsButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.unarmedButton.x, this.unarmedButton.y,
		this.unarmedButton.width, this.unarmedButton.height)) {
			this.activeItem = "unarmedButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.meleeWeaponsButton.x, this.meleeWeaponsButton.y,
		this.meleeWeaponsButton.width, this.meleeWeaponsButton.height)) {
			this.activeItem = "meleeWeaponsButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.throwingButton.x, this.throwingButton.y,
		this.throwingButton.width, this.throwingButton.height)) {
			this.activeItem = "throwingButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.firstAidButton.x, this.firstAidButton.y,
		this.firstAidButton.width, this.firstAidButton.height)) {
			this.activeItem = "firstAidButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.doctorButton.x, this.doctorButton.y,
		this.doctorButton.width, this.doctorButton.height)) {
			this.activeItem = "doctorButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.sneakButton.x, this.sneakButton.y,
		this.sneakButton.width, this.sneakButton.height)) {
			this.activeItem = "sneakButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.lockpickButton.x, this.lockpickButton.y,
		this.lockpickButton.width, this.lockpickButton.height)) {
			this.activeItem = "lockpickButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.stealButton.x, this.stealButton.y,
		this.stealButton.width, this.stealButton.height)) {
			this.activeItem = "stealButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.trapsButton.x, this.trapsButton.y,
		this.trapsButton.width, this.trapsButton.height)) {
			this.activeItem = "trapsButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.scienceButton.x, this.scienceButton.y,
		this.scienceButton.width, this.scienceButton.height)) {
			this.activeItem = "scienceButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.repairButton.x, this.repairButton.y,
		this.repairButton.width, this.repairButton.height)) {
			this.activeItem = "repairButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.speechButton.x, this.speechButton.y,
		this.speechButton.width, this.speechButton.height)) {
			this.activeItem = "speechButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.barterButton.x, this.barterButton.y,
		this.barterButton.width, this.barterButton.height)) {
			this.activeItem = "barterButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.gamblingButton.x, this.gamblingButton.y,
		this.gamblingButton.width, this.gamblingButton.height)) {
			this.activeItem = "gamblingButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.outdoorsmanButton.x, this.outdoorsmanButton.y,
		this.outdoorsmanButton.width, this.outdoorsmanButton.height)) {
			this.activeItem = "outdoorsmanButton";
	}
	
	
	
};

CharacterScreenState.prototype.render = function() {	
	_context.globalAlpha = 1;
	_context.drawImage(_assets["art/intrface/edtredt.frm"].frameInfo[0][0].img, this.x + 0, this.y + 0);	// bg	

	if(this.skillImage) {
		_context.drawImage(_assets[this.skillImage].frameInfo[0][0].img, this.x + 484, this.y + 309);
	}
	
	_context.drawImage(_assets["art/intrface/nameoff.frm"].frameInfo[0][0].img, this.x + 9, this.y + 0);
	_context.drawImage(_assets["art/intrface/ageoff.frm"].frameInfo[0][0].img, this.x + 154, this.y + 0);	
	_context.drawImage(_assets["art/intrface/sexoff.frm"].frameInfo[0][0].img, this.x + 235, this.y + 0);
	
	switch(this.activeTab) {
		case "perks":
			_context.drawImage(_assets["art/intrface/perksfdr.frm"].frameInfo[0][0].img, this.x + 11, this.y + 327);
			bitmapFontRenderer.renderString(_assets["font1.aaf"], "" + "--------------- TRAITS ---------------", this.x + 34, this.y + 364, "#00FF00");	
			break;
		case "karma":
			_context.drawImage(_assets["art/intrface/karmafdr.frm"].frameInfo[0][0].img, this.x + 11, this.y + 327);
			break;
		case "kills":
			_context.drawImage(_assets["art/intrface/killsfdr.frm"].frameInfo[0][0].img, this.x + 11, this.y + 327);
			break;
	}
	
	bitmapFontRenderer.renderString(_assets["font3.aaf"], "PERKS", this.x + 46, this.y + (this.activeTab == "perks") ? 332 : 333, (this.activeTab == "perks") ? "#907824" : "#806814");
	bitmapFontRenderer.renderString(_assets["font3.aaf"], "KARMA", this.x + 141, this.y + (this.activeTab == "karma") ? 332 : 333, (this.activeTab == "karma") ? "#907824" : "#806814");
	bitmapFontRenderer.renderString(_assets["font3.aaf"], "KILLS", this.x + 246, this.y + (this.activeTab == "kills") ? 332 : 333, (this.activeTab == "kills") ? "#907824" : "#806814");
	
	bitmapFontRenderer.renderString(_assets["font3.aaf"], mainState.player.name, this.x + 30, this.y + 6, "#907824");
	bitmapFontRenderer.renderString(_assets["font3.aaf"], "AGE " + mainState.player.age, this.x + 167, this.y + 6, "#907824");
	bitmapFontRenderer.renderString(_assets["font3.aaf"], mainState.player.sex, this.x + 254, this.y + 6, "#907824");
	

	bitmapFontRenderer.renderString(_assets["font3.aaf"], "PRINT", 364, 454, "#907824");	
	bitmapFontRenderer.renderString(_assets["font3.aaf"], "DONE", 476, 454, "#907824");	
	bitmapFontRenderer.renderString(_assets["font3.aaf"], "CANCEL", 572, 454, "#907824");

	bitmapFontRenderer.renderString(_assets["font3.aaf"], "SKILLS", 380, 5, "#907824");
	bitmapFontRenderer.renderString(_assets["font3.aaf"], "SKILL POINTS", 400, 233, "#907824");
	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Armor Class", 194, 179, "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Action Points", 194, 192, "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Carry Weight", 194, 205, "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Melee Damage", 194, 218, "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Damage Res.", 194, 231, "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Poison Res.", 194, 244, "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Radiation Res.", 194, 257, "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Sequence", 194, 270, "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Healing Rate", 194, 283, "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Critical Chance", 194, 296, "#00FF00");	
	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "" + mainState.player.stats["armorClass"].level, 288, 179, (this.selectedItem == "armorClass") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "" + mainState.player.stats["actionPoints"].level, 288, 192, "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "" + mainState.player.stats["carryWeight"].level, 288, 205, "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "" + mainState.player.stats["meleeDamage"].level, 288, 218, "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "" + mainState.player.stats["damageRes."].level, 288, 231, "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "" + mainState.player.stats["poisonRes."].level, 288, 244, "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "" + mainState.player.stats["radiationRes."].level, 288, 257, "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "" + mainState.player.stats["sequence"].level, 288, 270, "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "" + mainState.player.stats["healingRate"].level, 288, 283, "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "" + mainState.player.stats["criticalChance"].level, 288, 296, "#00FF00");	
	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Small Guns", 380, 27, (this.selectedItem == "smallGunsButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Big Guns", 380, 38, (this.selectedItem == "bigGunsButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Energy Weapons", 380, 49, (this.selectedItem == "energyWeaponsButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Unarmed", 380, 60, (this.selectedItem == "unarmedButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Melee Weapons", 380, 71, (this.selectedItem == "meleeWeaponsButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Throwing", 380, 82, (this.selectedItem == "throwingButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "First Aid", 380, 93, (this.selectedItem == "firstAidButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Doctor", 380, 104, (this.selectedItem == "doctorButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Sneak", 380, 115, (this.selectedItem == "sneakButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Lockpick", 380, 126, (this.selectedItem == "lockpickButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Steal", 380, 137, (this.selectedItem == "stealButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Traps", 380, 148, (this.selectedItem == "trapsButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Science", 380, 159, (this.selectedItem == "scienceButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Repair", 380, 170, (this.selectedItem == "repairButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Speech", 380, 181, (this.selectedItem == "speechButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Barter", 380, 192, (this.selectedItem == "barterButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Gambling", 380, 203, (this.selectedItem == "gamblingButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], "Outdoorsman", 380, 214, (this.selectedItem == "outdoorsmanButton") ? "#fcfc7c" : "#00FF00");	
	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], mainState.player.skills["Small Guns"].level + "%", 573, 27, (this.selectedItem == "smallGunsButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], mainState.player.skills["Big Guns"].level + "%", 573, 38, (this.selectedItem == "bigGunsButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], mainState.player.skills["Energy Weapons"].level + "%", 573, 49, (this.selectedItem == "energyWeaponsButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], mainState.player.skills["Unarmed"].level + "%", 573, 60, (this.selectedItem == "unarmedButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], mainState.player.skills["Melee Weapons"].level + "%", 573, 71, (this.selectedItem == "meleeWeaponsButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], mainState.player.skills["Throwing"].level + "%", 573, 82, (this.selectedItem == "throwingButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], mainState.player.skills["First Aid"].level + "%", 573, 93, (this.selectedItem == "firstAidButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], mainState.player.skills["Doctor"].level + "%", 573, 104, (this.selectedItem == "doctorButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], mainState.player.skills["Sneak"].level + "%", 573, 115, (this.selectedItem == "sneakButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], mainState.player.skills["Lockpick"].level + "%", 573, 126, (this.selectedItem == "lockpickButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], mainState.player.skills["Steal"].level + "%", 573, 137, (this.selectedItem == "stealButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], mainState.player.skills["Traps"].level + "%", 573, 148, (this.selectedItem == "trapsButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], mainState.player.skills["Science"].level + "%", 573, 159, (this.selectedItem == "scienceButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], mainState.player.skills["Repair"].level + "%", 573, 170, (this.selectedItem == "repairButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], mainState.player.skills["Speech"].level + "%", 573, 181, (this.selectedItem == "speechButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], mainState.player.skills["Barter"].level + "%", 573, 192, (this.selectedItem == "barterButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], mainState.player.skills["Gambling"].level + "%", 573, 203, (this.selectedItem == "gamblingButton") ? "#fcfc7c" : "#00FF00");	
	bitmapFontRenderer.renderString(_assets["font1.aaf"], mainState.player.skills["Outdoorsman"].level + "%", 573, 214, (this.selectedItem == "outdoorsmanButton") ? "#fcfc7c" : "#00FF00");
	
	_context.drawImage(_assets["art/intrface/slider.frm"].frameInfo[0][0].img, this.x + this.slider.x, this.y + this.slider.y);
	
	_context.drawImage((this.activeItem == "doneButton" && this.mouseState == 1) ? _assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img : _assets["art/intrface/lilredup.frm"].frameInfo[0][0].img,
		this.doneButton.x, this.doneButton.y);	// bg	
	_context.drawImage((this.activeItem == "cancelButton" && this.mouseState == 1) ? _assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img : _assets["art/intrface/lilredup.frm"].frameInfo[0][0].img,
		this.cancelButton.x, this.cancelButton.y);	// bg	
	_context.drawImage((this.activeItem == "printButton" && this.mouseState == 1) ? _assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img : _assets["art/intrface/lilredup.frm"].frameInfo[0][0].img,
		this.printButton.x, this.printButton.y);	// bg	
	
	
	
	_context.drawImage(_assets["art/intrface/stdarrow.frm"].frameInfo[0][0].img, _mouse.x, _mouse.y);		// cursor
};