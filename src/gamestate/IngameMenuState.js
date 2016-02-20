"use strict";

class IngameMenuState extends GameState {
	constructor() {
		super();

		this.menu = {
			x: ((SCREEN_WIDTH/2)|0) - 82, y: ((SCREEN_HEIGHT/2)|0) - 108,		// set in main_setResolution()
			activeIndex: -1,

			elements: [{		// Quit to Main Menu
				x: 13, y: 16,
				width: 137, height: 34,
				mouseState: 0,
				text: "INFO",
				textX: 51, textY: 8,
				action: function() {
					console.log("info");
				},
			},{		// Quit to Main Menu
				x: 13, y: 54,
				width: 137, height: 34,
				mouseState: 0,
				text: "HELP",
				textX: 49, textY: 8,
				action: function() {
					console.log("help");
				},
			},{		// Quit to Main Menu
				x: 13, y: 92,
				width: 137, height: 34,
				mouseState: 0,
				text: "ABOUT",
				textX: 41, textY: 8,
				action: function() {
					console.log("about");
				},
			},{		// Quit to Main Menu
				x: 13, y: 130,
				width: 137, height: 34,
				mouseState: 0,
				text: "RETURN",
				textX: 36, textY: 8,
				action: function() {
					console.log("return");
				},
			},{		// Quit to Main Menu
				x: 13, y: 168,
				width: 137, height: 34,
				mouseState: 0,
				text: "QUIT",
				textX: 49, textY: 8,
				action: function() {
					console.log("quit");
				},
			}],
		};
	};


	init() {};

	input(e) {
		switch(e.type) {
			case "mousemove":
				break;
			case "keydown":
				if(_keyboardStates[27]) {
					main_gameStateFunction('closeIngameMenu');
					return;
				}
				break;
			case "mousedown":
				break;
			case "mouseup":
				if(this.menu.activeIndex != -1) {
					if(isFunction(this.menu.elements[this.menu.activeIndex].action)) {
						this.menu.elements[this.menu.activeIndex].action();
						return;
					}
				}
				break;

			case "click":
				break;
			case 'contextmenu':	// switch input modes on mouse2
				break;
		};
	};

	update() {
		this.menu.activeIndex = -1;
		for(var i = 0; i < this.menu.elements.length; i++) {
			this.menu.elements[i].mouseState = 0;
			if(intersectTest(MOUSE.x,MOUSE.y,0,0, this.menu.x + this.menu.elements[i].x, this.menu.y + this.menu.elements[i].y, this.menu.elements[i].width, this.menu.elements[i].height)) {
				this.menu.activeIndex = i;
				if(MOUSE.c1) this.menu.elements[this.menu.activeIndex].mouseState = 1;
			}
		}
	};

	render() {
		_context.globalAlpha = 1;

		_context.drawImage(_assets["art/intrface/opbase.frm"].frameInfo[0][0].img, this.menu.x, this.menu.y);	// bg

		for(var i = 0; i < this.menu.elements.length; i++) {
			_context.drawImage( (this.menu.elements[i].mouseState == 0) ? _assets["art/intrface/opbtnoff.frm"].frameInfo[0][0].img : _assets["art/intrface/opbtnon.frm"].frameInfo[0][0].img,
				this.menu.x + this.menu.elements[i].x, this.menu.y + this.menu.elements[i].y);

			blitFontString(_assets["font3.aaf"], this.menu.elements[i].text ,
				this.menu.x + this.menu.elements[i].x + this.menu.elements[i].textX,
				this.menu.y + this.menu.elements[i].y + this.menu.elements[i].textY,
				(this.menu.elements[i].mouseState == 0) ? "#907824" : "#806814");
		}
		_context.drawImage(_assets["art/intrface/stdarrow.frm"].frameInfo[0][0].img, MOUSE.x, MOUSE.y);		// cursor

	};

};
