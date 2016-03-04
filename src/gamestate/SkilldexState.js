"use strict";

class SkilldexState extends GameState {
	constructor() {
		super();

		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
		this.activeItem = -1;
		this.mouseState = -1;
		this.closeButton = {
			x: 48,
			y: 338,
			width: 15,
			height: 16,
		};

		this.menuItems = [		// @TODO: replace with strings from skilldex.msg
			{
				text: "SNEAK",
				action: 0,
				x: 14, y: 44,
				width: 86, height: 33,
				textX: 18, textY: 6,
			}, {
				text: "LOCKPICK",
				action: 0,
				x: 14, y: 80,
				width: 86, height: 33,
				textX: 6, textY: 6,
			}, {
				text: "STEAL",
				action: 0,
				x: 14, y: 116,
				width: 86, height: 33,
				textX: 20, textY: 6,
			}, {
				text: "TRAPS",
				action: 0,
				x: 14, y: 152,
				width: 86, height: 33,
				textX: 17, textY: 6,
			}, {
				text: "FIRST AID",
				action: 0,
				x: 14, y: 188,
				width: 86, height: 33,
				textX: 5, textY: 6,
			}, {
				text: "DOCTOR",
				action: 0,
				x: 14, y: 224,
				width: 86, height: 33,
				textX: 11, textY: 6,
			}, {
				text: "SCIENCE",
				action: 0,
				x: 14, y: 260,
				width: 86, height: 33,
				textX: 13, textY: 6,
			}, {
				text: "REPAIR",
				action: 0,
				x: 14, y: 296,
				width: 86, height: 33,
				textX: 13, textY: 6,
			},
		];
	};


	action(action) {
		main_gameStateFunction('closeSkilldex');
		switch(action) {
			case 0:
				//sneak
				break;
		}
	};


	input(e) {
		switch(e.type) {
			case "mousemove":
				break;
			case "keydown":
				if(_keyboard['Escape']) {
					main_gameStateFunction('closeSkilldex');
					return;
				}
				break;
			case "mousedown":
				this.mouseState = 1;
				break;
			case "mouseup":
				this.mouseState = 0;
				break;

			case "click":
				switch(this.activeItem) {
					case -1:
						break;
					case 0:
						this.action("sneak");
						break;
					case 1:
						this.action("lockpick");
						break;
					case "closeButton":
						main_gameStateFunction('closeSkilldex');
						this.activeItem = -1;	// reset this so that it mouse event doesn't propagate through on reopen
						break;
				}
				break;
			case 'contextmenu':	// switch input modes on mouse2
				break;
		};
	};

	update() {
		this.activeItem = -1;
		if(intersectTest(_mouse.x,_mouse.y,0,0,
			this.x + this.closeButton.x,
			this.y + this.closeButton.y,
			this.closeButton.width,
			this.closeButton.height)) {
				this.activeItem = "closeButton";
				return;
			}

		for(var i = 0; i < this.menuItems.length; i++) {
			if(intersectTest(_mouse.x,_mouse.y,0,0,
				this.x + this.menuItems[i].x,
				this.y + this.menuItems[i].y,
				this.menuItems[i].width,
				this.menuItems[i].height)) {
					this.activeItem = i;
					return;
				}
		}
	};

	render() {
		_context.drawImage(_assets["art/intrface/skldxbox.frm"].frameInfo[0][0].img, this.x, this.y);	// interface

		blitFontString(_assets["font3.aaf"], "SKILLDEX" ,
			this.x + 55,
			this.y + 14,
			"#907824");

		blitFontString(_assets["font3.aaf"], "CANCEL" ,
			this.x + 72,
			this.y + 337,
			(this.mouseState == 1 && this.activeItem == "closeButton") ? "#806814" : "#907824");


		_context.drawImage((this.mouseState == 1 && this.activeItem == "closeButton") ? _assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img : _assets["art/intrface/lilredup.frm"].frameInfo[0][0].img,
			this.x + this.closeButton.x,
			this.y + this.closeButton.y);

		for(var i = 0; i < this.menuItems.length; i++) {
			_context.drawImage((this.mouseState == 1 && this.activeItem == i) ? _assets["art/intrface/skldxon.frm"].frameInfo[0][0].img : _assets["art/intrface/skldxoff.frm"].frameInfo[0][0].img,
				this.x + this.menuItems[i].x,
				this.y + this.menuItems[i].y);

			blitFontString(_assets["font3.aaf"], this.menuItems[i].text ,
				this.x + this.menuItems[i].x + this.menuItems[i].textX,
				this.y + this.menuItems[i].y + this.menuItems[i].textY,
				(this.mouseState == 1 && this.activeItem == i) ? "#806814" : "#907824");
		}

		_context.drawImage(_assets["art/intrface/stdarrow.frm"].frameInfo[0][0].img, _mouse.x, _mouse.y);

	};


};
