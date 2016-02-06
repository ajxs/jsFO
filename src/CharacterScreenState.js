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

		this.slider = {
			x: 592, y: 16,
			width: 43, height: 29,
		};

		this.cancelButton = {
			x: 553, y: 454,
			width: 15, height: 16,
		};

		this.doneButton = {
			x: 456, y: 454,
			width: 15, height: 16,
		};

		this.printButton = {
			x: 344, y: 454,
			width: 15, height: 16,
		};

		this.perksTab = {
			x: 11, y: 327,
			width: 96, height: 25,
		};

		this.karmaTab = {
			x: 107, y: 327,
			width: 96, height: 25,
		};

		this.killsTab = {
			x: 204, y: 327,
			width: 96, height: 25,
		};

		this.smallGunsButton = {
			x: 380, y: 27,
			width: 100, height: 11,
		};
		this.bigGunsButton = {
			x: 380, y: 38,
			width: 100, height: 11,
		};
		this.energyWeaponsButton = {
			x: 380, y: 49,
			width: 100, height: 11,
		};
		this.unarmedButton = {
			x: 380, y: 60,
			width: 100, height: 11,
		};
		this.meleeWeaponsButton = {
			x: 380, y: 71,
			width: 100, height: 11,
		};
		this.throwingButton = {
			x: 380, y: 82,
			width: 100, height: 11,
		};
		this.firstAidButton = {
			x: 380, y: 93,
			width: 100, height: 11,
		};
		this.doctorButton = {
			x: 380, y: 104,
			width: 100, height: 11,
		};
		this.sneakButton = {
			x: 380, y: 115,
			width: 100, height: 11,
		};
		this.lockpickButton = {
			x: 380, y: 126,
			width: 100, height: 11,
		};
		this.stealButton = {
			x: 380, y: 137,
			width: 100, height: 11,
		};
		this.trapsButton = {
			x: 380, y: 148,
			width: 100, height: 11,
		};
		this.scienceButton = {
			x: 380, y: 159,
			width: 100, height: 11,
		};
		this.repairButton = {
			x: 380, y: 170,
			width: 100, height: 11,
		};
		this.speechButton = {
			x: 380, y: 181,
			width: 100, height: 11,
		};
		this.barterButton = {
			x: 380, y: 192,
			width: 100, height: 11,
		};
		this.gamblingButton = {
			x: 380, y: 203,
			width: 100, height: 11,
		};
		this.outdoorsmanButton = {
			x: 380, y: 214,
			width: 100, height: 11,
		};

		this.strengthButton = {
			x: 100, y: 41,
			width: 58, height: 17,
		};
		this.perceptionButton = {
			x: 100, y: 74,
			width: 58, height: 17,
		};
		this.enduranceButton = {
			x: 100, y: 107,
			width: 58, height: 17,
		};
		this.charismaButton = {
			x: 100, y: 140,
			width: 58, height: 17,
		};
		this.intelligenceButton = {
			x: 100, y: 173,
			width: 58, height: 17,
		};
		this.agilityButton = {
			x: 100, y: 206,
			width: 58, height: 17,
		};
		this.luckButton = {
			x: 100, y: 239,
			width: 58, height: 17,
		};


		this.armorClassButton = {
			x: 194, y: 179,
			width: 118, height: 11,
		};
		this.actionPointsButton = {
			x: 194, y: 192,
			width: 118, height: 11,
		};
		this.carryWeightButton = {
			x: 194, y: 205,
			width: 118, height: 11,
		};
		this.meleeDamageButton = {
			x: 194, y: 218,
			width: 118, height: 11,
		};
		this.damageResButton = {
			x: 194, y: 231,
			width: 118, height: 11,
		};
		this.poisonResButton = {
			x: 194, y: 244,
			width: 118, height: 11,
		};
		this.radiationResButton = {
			x: 194, y: 257,
			width: 118, height: 11,
		};
		this.sequenceButton = {
			x: 194, y: 270,
			width: 118, height: 11,
		};
		this.healingRateButton = {
			x: 194, y: 283,
			width: 118, height: 11,
		};
		this.criticalChanceButton = {
			x: 194, y: 296,
			width: 118, height: 11,
		};


		this.levelButton = {
			x: 32, y: 280,
			width: 118, height: 11,
		};
		this.expButton = {
			x: 32, y: 291,
			width: 118, height: 11,
		};
		this.nextLevelButton = {
			x: 32, y: 302,
			width: 118, height: 11,
		};

	};



	input(e) {
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
						main_gameStateFunction('closeCharacterScreen');
						this.activeItem = -1;	// reset this so that it mouse event doesn't propagate through on reopen
						break;
					case "cancelButton":
						main_gameStateFunction('closeCharacterScreen');
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
			case 'contextmenu':	// switch input modes on mouse2
				break;
		};
	};

	update() {	//@TODO: FIX THIS MESS

		this.activeItem = -1;
		if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.printButton.x, this.y + this.printButton.y,
			this.printButton.width, this.printButton.height)) {
				this.activeItem = "printButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.cancelButton.x, this.y + this.cancelButton.y,
			this.cancelButton.width, this.cancelButton.height)) {
				this.activeItem = "cancelButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.doneButton.x, this.y + this.doneButton.y,
			this.doneButton.width, this.doneButton.height)) {
				this.activeItem = "doneButton";
		}

		if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.perksTab.x, this.y + this.perksTab.y,
			this.perksTab.width, this.perksTab.height)) {
				this.activeItem = "perksTab";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.karmaTab.x, this.y + this.karmaTab.y,
			this.karmaTab.width, this.karmaTab.height)) {
				this.activeItem = "karmaTab";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.killsTab.x, this.y + this.killsTab.y,
			this.killsTab.width, this.killsTab.height)) {
				this.activeItem = "killsTab";
		}

		if(intersectTest(MOUSE.x,MOUSE.y,0,0,		// check skills. ha
			this.x + this.smallGunsButton.x, this.y + this.smallGunsButton.y,
			this.smallGunsButton.width, this.smallGunsButton.height)) {
				this.activeItem = "smallGunsButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.bigGunsButton.x, this.y + this.bigGunsButton.y,
			this.bigGunsButton.width, this.bigGunsButton.height)) {
				this.activeItem = "bigGunsButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.energyWeaponsButton.x, this.y + this.energyWeaponsButton.y,
			this.energyWeaponsButton.width, this.energyWeaponsButton.height)) {
				this.activeItem = "energyWeaponsButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.unarmedButton.x, this.y + this.unarmedButton.y,
			this.unarmedButton.width, this.unarmedButton.height)) {
				this.activeItem = "unarmedButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.meleeWeaponsButton.x, this.y + this.meleeWeaponsButton.y,
			this.meleeWeaponsButton.width, this.meleeWeaponsButton.height)) {
				this.activeItem = "meleeWeaponsButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.throwingButton.x, this.y + this.throwingButton.y,
			this.throwingButton.width, this.throwingButton.height)) {
				this.activeItem = "throwingButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.firstAidButton.x, this.y + this.firstAidButton.y,
			this.firstAidButton.width, this.firstAidButton.height)) {
				this.activeItem = "firstAidButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.doctorButton.x, this.y + this.doctorButton.y,
			this.doctorButton.width, this.doctorButton.height)) {
				this.activeItem = "doctorButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.sneakButton.x, this.y + this.sneakButton.y,
			this.sneakButton.width, this.sneakButton.height)) {
				this.activeItem = "sneakButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.lockpickButton.x, this.y + this.lockpickButton.y,
			this.lockpickButton.width, this.lockpickButton.height)) {
				this.activeItem = "lockpickButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.stealButton.x, this.y + this.stealButton.y,
			this.stealButton.width, this.stealButton.height)) {
				this.activeItem = "stealButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.trapsButton.x, this.y + this.trapsButton.y,
			this.trapsButton.width, this.trapsButton.height)) {
				this.activeItem = "trapsButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.scienceButton.x, this.y + this.scienceButton.y,
			this.scienceButton.width, this.scienceButton.height)) {
				this.activeItem = "scienceButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.repairButton.x, this.y + this.repairButton.y,
			this.repairButton.width, this.repairButton.height)) {
				this.activeItem = "repairButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.speechButton.x, this.y + this.speechButton.y,
			this.speechButton.width, this.speechButton.height)) {
				this.activeItem = "speechButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.barterButton.x, this.y + this.barterButton.y,
			this.barterButton.width, this.barterButton.height)) {
				this.activeItem = "barterButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.gamblingButton.x, this.y + this.gamblingButton.y,
			this.gamblingButton.width, this.gamblingButton.height)) {
				this.activeItem = "gamblingButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.outdoorsmanButton.x, this.y + this.outdoorsmanButton.y,
			this.outdoorsmanButton.width, this.outdoorsmanButton.height)) {
				this.activeItem = "outdoorsmanButton";
		}


		if(intersectTest(MOUSE.x,MOUSE.y,0,0,		// check skills. ha
			this.x + this.strengthButton.x, this.y + this.strengthButton.y,
			this.strengthButton.width, this.strengthButton.height)) {
				this.activeItem = "strengthButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.perceptionButton.x, this.y + this.perceptionButton.y,
			this.perceptionButton.width, this.perceptionButton.height)) {
				this.activeItem = "perceptionButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.enduranceButton.x, this.y + this.enduranceButton.y,
			this.enduranceButton.width, this.enduranceButton.height)) {
				this.activeItem = "enduranceButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.charismaButton.x, this.y + this.charismaButton.y,
			this.charismaButton.width, this.charismaButton.height)) {
				this.activeItem = "charismaButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.intelligenceButton.x, this.y + this.intelligenceButton.y,
			this.intelligenceButton.width, this.intelligenceButton.height)) {
				this.activeItem = "intelligenceButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.agilityButton.x, this.y + this.agilityButton.y,
			this.agilityButton.width, this.agilityButton.height)) {
				this.activeItem = "agilityButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.luckButton.x, this.y + this.luckButton.y,
			this.luckButton.width, this.luckButton.height)) {
				this.activeItem = "luckButton";
		}

		if(intersectTest(MOUSE.x,MOUSE.y,0,0,		// check skills. ha
			this.x + this.armorClassButton.x, this.y + this.armorClassButton.y,
			this.armorClassButton.width, this.armorClassButton.height)) {
				this.activeItem = "armorClassButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.actionPointsButton.x, this.y + this.actionPointsButton.y,
			this.actionPointsButton.width, this.actionPointsButton.height)) {
				this.activeItem = "actionPointsButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.carryWeightButton.x, this.y + this.carryWeightButton.y,
			this.carryWeightButton.width, this.carryWeightButton.height)) {
				this.activeItem = "carryWeightButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.meleeDamageButton.x, this.y + this.meleeDamageButton.y,
			this.meleeDamageButton.width, this.meleeDamageButton.height)) {
				this.activeItem = "meleeDamageButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.damageResButton.x, this.y + this.damageResButton.y,
			this.damageResButton.width, this.damageResButton.height)) {
				this.activeItem = "damageResButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.poisonResButton.x, this.y + this.poisonResButton.y,
			this.poisonResButton.width, this.poisonResButton.height)) {
				this.activeItem = "poisonResButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.radiationResButton.x, this.y + this.radiationResButton.y,
			this.radiationResButton.width, this.radiationResButton.height)) {
				this.activeItem = "radiationResButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.sequenceButton.x, this.y + this.sequenceButton.y,
			this.sequenceButton.width, this.sequenceButton.height)) {
				this.activeItem = "sequenceButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.healingRateButton.x, this.y + this.healingRateButton.y,
			this.healingRateButton.width, this.healingRateButton.height)) {
				this.activeItem = "healingRateButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.criticalChanceButton.x, this.y + this.criticalChanceButton.y,
			this.criticalChanceButton.width, this.criticalChanceButton.height)) {
				this.activeItem = "criticalChanceButton";
		}


		if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.levelButton.x, this.y + this.levelButton.y,
			this.levelButton.width, this.levelButton.height)) {
				this.activeItem = "levelButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.expButton.x, this.y + this.expButton.y,
			this.expButton.width, this.expButton.height)) {
				this.activeItem = "expButton";
		} else if(intersectTest(MOUSE.x,MOUSE.y,0,0,
			this.x + this.nextLevelButton.x, this.y + this.nextLevelButton.y,
			this.nextLevelButton.width, this.nextLevelButton.height)) {
				this.activeItem = "nextLevelButton";
		}

	};

	render() {
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

		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Level: 2", 32, 280, (this.selectedItem == "levelButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Exp: 1,999", 32, 291, (this.selectedItem == "expButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Next Level: 2000", 32, 302, (this.selectedItem == "nextLevelButton") ? "#fcfc7c" : "#00FF00");

		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Hit Points 29/34", this.x + 194, this.y + 46, (this.selectedItem == "hitPointsButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Poisoned", this.x + 194, this.y + 59, "#183018");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Radiated", this.x + 194, this.y + 72, "#183018");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Eye Damage", this.x + 194, this.y + 85, "#183018");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Crippled Right Arm", this.x + 194, this.y + 98, "#183018");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Crippled Left Arm", this.x + 194, this.y + 111, "#183018");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Crippled Right Leg", this.x + 194, this.y + 124, "#183018");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Crippled Left Leg", this.x + 194, this.y + 137, "#183018");


		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Armor Class", 194, 179, (this.selectedItem == "armorClassButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Action Points", 194, 192, (this.selectedItem == "actionPointsButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Carry Weight", 194, 205, (this.selectedItem == "carryWeightButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Melee Damage", 194, 218, (this.selectedItem == "meleeDamageButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Damage Res.", 194, 231, (this.selectedItem == "damageResButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Poison Res.", 194, 244, (this.selectedItem == "poisonResButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Radiation Res.", 194, 257, (this.selectedItem == "radiationResButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Sequence", 194, 270, (this.selectedItem == "sequenceButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Healing Rate", 194, 283, (this.selectedItem == "healingRateButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Critical Chance", 194, 296, (this.selectedItem == "criticalChanceButton") ? "#fcfc7c" : "#00FF00");

		bitmapFontRenderer.renderString(_assets["font1.aaf"], "" + mainState.player.stats["armorClass"].level, 288, 179, (this.selectedItem == "armorClassButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "" + mainState.player.stats["actionPoints"].level, 288, 192, (this.selectedItem == "actionPointsButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "" + mainState.player.stats["carryWeight"].level, 288, 205, (this.selectedItem == "carryWeightButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "" + mainState.player.stats["meleeDamage"].level, 288, 218, (this.selectedItem == "meleeDamageButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "" + mainState.player.stats["damageRes"].level, 288, 231, (this.selectedItem == "damageResButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "" + mainState.player.stats["poisonRes"].level, 288, 244, (this.selectedItem == "poisonResButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "" + mainState.player.stats["radiationRes"].level, 288, 257, (this.selectedItem == "radiationResButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "" + mainState.player.stats["sequence"].level, 288, 270, (this.selectedItem == "sequenceButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "" + mainState.player.stats["healingRate"].level, 288, 283, (this.selectedItem == "healingRateButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "" + mainState.player.stats["criticalChance"].level, 288, 296, (this.selectedItem == "criticalChanceButton") ? "#fcfc7c" : "#00FF00");

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

		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Great", 103, 45, (this.selectedItem == "strengthButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Great", 103, 78, (this.selectedItem == "perceptionButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Great", 103, 111, (this.selectedItem == "enduranceButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Great", 103, 144, (this.selectedItem == "charismaButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Great", 103, 177, (this.selectedItem == "intelligenceButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Great", 103, 210, (this.selectedItem == "agilityButton") ? "#fcfc7c" : "#00FF00");
		bitmapFontRenderer.renderString(_assets["font1.aaf"], "Great", 103, 243, (this.selectedItem == "luckButton") ? "#fcfc7c" : "#00FF00");


		_context.drawImage(_assets["art/intrface/slider.frm"].frameInfo[0][0].img, this.x + this.slider.x, this.y + this.slider.y);

		_context.drawImage((this.activeItem == "doneButton" && this.mouseState == 1) ? _assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img : _assets["art/intrface/lilredup.frm"].frameInfo[0][0].img,
			this.doneButton.x, this.doneButton.y);	// bg
		_context.drawImage((this.activeItem == "cancelButton" && this.mouseState == 1) ? _assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img : _assets["art/intrface/lilredup.frm"].frameInfo[0][0].img,
			this.cancelButton.x, this.cancelButton.y);	// bg
		_context.drawImage((this.activeItem == "printButton" && this.mouseState == 1) ? _assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img : _assets["art/intrface/lilredup.frm"].frameInfo[0][0].img,
			this.printButton.x, this.printButton.y);	// bg



		_context.drawImage(_assets["art/intrface/stdarrow.frm"].frameInfo[0][0].img, MOUSE.x, MOUSE.y);		// cursor
	};

};
