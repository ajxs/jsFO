"use strict";

class CharacterScreenState extends GameState {
	constructor() {
		super();

		this.activeItem = -1;
		this.mouseState = -1;
		this.activeMenu = -1;
		this.selectedItem = -1;


		this.activeTab = "perks";
		this.skillImage = "art/skilldex/morecrit.frm";

		this.x = 0;
		this.y = 0;

		this.interface = new Interface("jsfdata/interface/charScreenInterface.json");

	};



	input(e) {
		switch(e.type) {
			case "mousedown":
				this.mouseState = 1;
				break;
			case "mouseup":
				this.mouseState = 0;
				switch(this.interface.clickHandler()) {
					case "printButton":
						//this.activeItem = -1;	// reset this so that it mouse event doesn't propagate through on reopen
						break;
					case "doneButton":
						main_gameStateFunction('closeCharacterScreen');
						break;
					case "cancelButton":
						main_gameStateFunction('closeCharacterScreen');
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

					case "strengthButton":
						this.selectedItem = "strengthButton";
						break;
					case "perceptionButton":
						this.selectedItem = "perceptionButton";
						break;
					case "enduranceButton":
						this.selectedItem = "enduranceButton";
						break;
					case "charismaButton":
						this.selectedItem = "charismaButton";
						break;
					case "intelligenceButton":
						this.selectedItem = "intelligenceButton";
						break;
					case "agilityButton":
						this.selectedItem = "agilityButton";
						break;
					case "luckButton":
						this.selectedItem = "luckButton";
						break;


					case "armorClassButton":
						this.selectedItem = "armorClassButton";
						break;
					case "actionPointsButton":
						this.selectedItem = "actionPointsButton";
						break;
					case "carryWeightButton":
						this.selectedItem = "carryWeightButton";
						break;
					case "meleeDamageButton":
						this.selectedItem = "meleeDamageButton";
						break;
					case "damageResButton":
						this.selectedItem = "damageResButton";
						break;
					case "poisonResButton":
						this.selectedItem = "poisonResButton";
						break;
					case "radiationResButton":
						this.selectedItem = "radiationResButton";
						break;
					case "sequenceButton":
						this.selectedItem = "sequenceButton";
						break;
					case "healingRateButton":
						this.selectedItem = "healingRateButton";
						break;
					case "criticalChanceButton":
						this.selectedItem = "criticalChanceButton";
						break;

					case "levelButton":
						this.selectedItem = "levelButton";
						break;
					case "expButton":
						this.selectedItem = "expButton";
						break;
					case "nextLevelButton":
						this.selectedItem = "nextLevelButton";
						break;
				}
				break;
			default:
				break;
		};
	};

	update() {	//@TODO: FIX THIS MESS
		this.interface.update();
	};

	render() {
		_context.globalAlpha = 1;
		blitFRM(_assets["art/intrface/edtredt.frm"],		// background
			_context,
			this.x,
			this.y);

		if(this.skillImage) {
			blitFRM(_assets[this.skillImage],		// background
				_context,
				this.x + 484,
				this.y + 309);
		}

		blitFRM(_assets["art/intrface/nameoff.frm"],
			_context,
			this.x + 9,
			this.y);

		blitFRM(_assets["art/intrface/ageoff.frm"],
			_context,
			this.x + 154,
			this.y);

		blitFRM(_assets["art/intrface/sexoff.frm"],
			_context,
			this.x + 235,
			this.y);


		switch(this.activeTab) {
			case "perks":
				blitFRM(_assets["art/intrface/perksfdr.frm"],
					_context,
					this.x + 11,
					this.y + 327);

				blitFontString(_assets["font1.aaf"], "" + "--------------- TRAITS ---------------", this.x + 34, this.y + 364, "#00FF00");
				break;
			case "karma":
				blitFRM(_assets["art/intrface/karmafdr.frm"],
					_context,
					this.x + 11,
					this.y + 327);
				break;
			case "kills":
				blitFRM(_assets["art/intrface/killsfdr.frm"],
					_context,
					this.x + 11,
					this.y + 327);
				break;
		}

		blitFontString(_assets["font3.aaf"], "PERKS", this.x + 46, this.y + (this.activeTab == "perks") ? 332 : 333, (this.activeTab == "perks") ? "#907824" : "#806814");
		blitFontString(_assets["font3.aaf"], "KARMA", this.x + 141, this.y + (this.activeTab == "karma") ? 332 : 333, (this.activeTab == "karma") ? "#907824" : "#806814");
		blitFontString(_assets["font3.aaf"], "KILLS", this.x + 246, this.y + (this.activeTab == "kills") ? 332 : 333, (this.activeTab == "kills") ? "#907824" : "#806814");

		blitFontString(_assets["font3.aaf"], mainState.player.name, this.x + 30, this.y + 6, "#907824");
		blitFontString(_assets["font3.aaf"], "AGE " + mainState.player.age, this.x + 167, this.y + 6, "#907824");
		blitFontString(_assets["font3.aaf"], mainState.player.sex, this.x + 254, this.y + 6, "#907824");


		blitFontString(_assets["font3.aaf"], "PRINT", 364, 454, "#907824");
		blitFontString(_assets["font3.aaf"], "DONE", 476, 454, "#907824");
		blitFontString(_assets["font3.aaf"], "CANCEL", 572, 454, "#907824");

		blitFontString(_assets["font3.aaf"], "SKILLS", 380, 5, "#907824");
		blitFontString(_assets["font3.aaf"], "SKILL POINTS", 400, 233, "#907824");

		blitFontString(_assets["font1.aaf"], "Level: 2", 32, 280, (this.selectedItem == "levelButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Exp: 1,999", 32, 291, (this.selectedItem == "expButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Next Level: 2000", 32, 302, (this.selectedItem == "nextLevelButton") ? "#fcfc7c" : "#00FF00");

		blitFontString(_assets["font1.aaf"], "Hit Points 29/34", this.x + 194, this.y + 46, (this.selectedItem == "hitPointsButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Poisoned", this.x + 194, this.y + 59, "#183018");
		blitFontString(_assets["font1.aaf"], "Radiated", this.x + 194, this.y + 72, "#183018");
		blitFontString(_assets["font1.aaf"], "Eye Damage", this.x + 194, this.y + 85, "#183018");
		blitFontString(_assets["font1.aaf"], "Crippled Right Arm", this.x + 194, this.y + 98, "#183018");
		blitFontString(_assets["font1.aaf"], "Crippled Left Arm", this.x + 194, this.y + 111, "#183018");
		blitFontString(_assets["font1.aaf"], "Crippled Right Leg", this.x + 194, this.y + 124, "#183018");
		blitFontString(_assets["font1.aaf"], "Crippled Left Leg", this.x + 194, this.y + 137, "#183018");


		blitFontString(_assets["font1.aaf"], "Armor Class", 194, 179, (this.selectedItem == "armorClassButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Action Points", 194, 192, (this.selectedItem == "actionPointsButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Carry Weight", 194, 205, (this.selectedItem == "carryWeightButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Melee Damage", 194, 218, (this.selectedItem == "meleeDamageButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Damage Res.", 194, 231, (this.selectedItem == "damageResButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Poison Res.", 194, 244, (this.selectedItem == "poisonResButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Radiation Res.", 194, 257, (this.selectedItem == "radiationResButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Sequence", 194, 270, (this.selectedItem == "sequenceButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Healing Rate", 194, 283, (this.selectedItem == "healingRateButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Critical Chance", 194, 296, (this.selectedItem == "criticalChanceButton") ? "#fcfc7c" : "#00FF00");

		blitFontString(_assets["font1.aaf"], "" + mainState.player.stats["armorClass"].level, 288, 179, (this.selectedItem == "armorClassButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "" + mainState.player.stats["actionPoints"].level, 288, 192, (this.selectedItem == "actionPointsButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "" + mainState.player.stats["carryWeight"].level, 288, 205, (this.selectedItem == "carryWeightButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "" + mainState.player.stats["meleeDamage"].level, 288, 218, (this.selectedItem == "meleeDamageButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "" + mainState.player.stats["damageRes"].level, 288, 231, (this.selectedItem == "damageResButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "" + mainState.player.stats["poisonRes"].level, 288, 244, (this.selectedItem == "poisonResButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "" + mainState.player.stats["radiationRes"].level, 288, 257, (this.selectedItem == "radiationResButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "" + mainState.player.stats["sequence"].level, 288, 270, (this.selectedItem == "sequenceButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "" + mainState.player.stats["healingRate"].level, 288, 283, (this.selectedItem == "healingRateButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "" + mainState.player.stats["criticalChance"].level, 288, 296, (this.selectedItem == "criticalChanceButton") ? "#fcfc7c" : "#00FF00");

		blitFontString(_assets["font1.aaf"], "Small Guns", 380, 27, (this.selectedItem == "smallGunsButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Big Guns", 380, 38, (this.selectedItem == "bigGunsButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Energy Weapons", 380, 49, (this.selectedItem == "energyWeaponsButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Unarmed", 380, 60, (this.selectedItem == "unarmedButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Melee Weapons", 380, 71, (this.selectedItem == "meleeWeaponsButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Throwing", 380, 82, (this.selectedItem == "throwingButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "First Aid", 380, 93, (this.selectedItem == "firstAidButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Doctor", 380, 104, (this.selectedItem == "doctorButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Sneak", 380, 115, (this.selectedItem == "sneakButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Lockpick", 380, 126, (this.selectedItem == "lockpickButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Steal", 380, 137, (this.selectedItem == "stealButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Traps", 380, 148, (this.selectedItem == "trapsButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Science", 380, 159, (this.selectedItem == "scienceButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Repair", 380, 170, (this.selectedItem == "repairButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Speech", 380, 181, (this.selectedItem == "speechButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Barter", 380, 192, (this.selectedItem == "barterButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Gambling", 380, 203, (this.selectedItem == "gamblingButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Outdoorsman", 380, 214, (this.selectedItem == "outdoorsmanButton") ? "#fcfc7c" : "#00FF00");

		blitFontString(_assets["font1.aaf"], mainState.player.skills["Small Guns"].level + "%", 573, 27, (this.selectedItem == "smallGunsButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], mainState.player.skills["Big Guns"].level + "%", 573, 38, (this.selectedItem == "bigGunsButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], mainState.player.skills["Energy Weapons"].level + "%", 573, 49, (this.selectedItem == "energyWeaponsButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], mainState.player.skills["Unarmed"].level + "%", 573, 60, (this.selectedItem == "unarmedButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], mainState.player.skills["Melee Weapons"].level + "%", 573, 71, (this.selectedItem == "meleeWeaponsButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], mainState.player.skills["Throwing"].level + "%", 573, 82, (this.selectedItem == "throwingButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], mainState.player.skills["First Aid"].level + "%", 573, 93, (this.selectedItem == "firstAidButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], mainState.player.skills["Doctor"].level + "%", 573, 104, (this.selectedItem == "doctorButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], mainState.player.skills["Sneak"].level + "%", 573, 115, (this.selectedItem == "sneakButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], mainState.player.skills["Lockpick"].level + "%", 573, 126, (this.selectedItem == "lockpickButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], mainState.player.skills["Steal"].level + "%", 573, 137, (this.selectedItem == "stealButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], mainState.player.skills["Traps"].level + "%", 573, 148, (this.selectedItem == "trapsButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], mainState.player.skills["Science"].level + "%", 573, 159, (this.selectedItem == "scienceButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], mainState.player.skills["Repair"].level + "%", 573, 170, (this.selectedItem == "repairButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], mainState.player.skills["Speech"].level + "%", 573, 181, (this.selectedItem == "speechButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], mainState.player.skills["Barter"].level + "%", 573, 192, (this.selectedItem == "barterButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], mainState.player.skills["Gambling"].level + "%", 573, 203, (this.selectedItem == "gamblingButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], mainState.player.skills["Outdoorsman"].level + "%", 573, 214, (this.selectedItem == "outdoorsmanButton") ? "#fcfc7c" : "#00FF00");

		blitFontString(_assets["font1.aaf"], "Great", 103, 45, (this.selectedItem == "strengthButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Great", 103, 78, (this.selectedItem == "perceptionButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Great", 103, 111, (this.selectedItem == "enduranceButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Great", 103, 144, (this.selectedItem == "charismaButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Great", 103, 177, (this.selectedItem == "intelligenceButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Great", 103, 210, (this.selectedItem == "agilityButton") ? "#fcfc7c" : "#00FF00");
		blitFontString(_assets["font1.aaf"], "Great", 103, 243, (this.selectedItem == "luckButton") ? "#fcfc7c" : "#00FF00");


		/* _context.drawImage(_assets["art/intrface/slider.frm"].frameInfo[0][0].img, this.x + this.slider.x, this.y + this.slider.y);

		_context.drawImage((this.activeItem == "doneButton" && this.mouseState == 1) ? _assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img : _assets["art/intrface/lilredup.frm"].frameInfo[0][0].img,
			this.doneButton.x, this.doneButton.y);	// bg
		_context.drawImage((this.activeItem == "cancelButton" && this.mouseState == 1) ? _assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img : _assets["art/intrface/lilredup.frm"].frameInfo[0][0].img,
			this.cancelButton.x, this.cancelButton.y);	// bg
		_context.drawImage((this.activeItem == "printButton" && this.mouseState == 1) ? _assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img : _assets["art/intrface/lilredup.frm"].frameInfo[0][0].img,
			this.printButton.x, this.printButton.y);	// bg */


		blitFRM(_assets["art/intrface/stdarrow.frm"],		// cursor
			_context,
			_mouse.x,
			_mouse.y);

	};

};
