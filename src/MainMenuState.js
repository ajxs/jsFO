"use strict";



class MainMenuState extends GameState {
	constructor() {
		super();

		this.backgroundImage = document.getElementById('MainMenuState_bg');
		this.buttonImage = document.getElementById('MainMenuState_btn');

		this.menu = {
			x: (_screenWidth*0.05)|0,
			y: (_screenWidth*0.185)|0,		// set in main_setResolution()
			activeIndex: -1,

			elements: [{		// Quit to Main Menu
				x: 0, y: 0,
				width: 191, height: 35,
				mouseState: 0,
				text: "NEW GAME",
				textX: 50, textY: 5,
				action: function() {
					main_loadGame(newGame);
				},
			},{		// Quit to Main Menu
				x: 0, y: 40,
				width: 191, height: 35,
				mouseState: 0,
				text: "MORE",
				textX: 50, textY: 5,
				action: function() {
					console.log("HELP");
				},
			},{		// Quit to Main Menu
				x: 0, y: 80,
				width: 191, height: 35,
				mouseState: 0,
				text: "COMING",
				textX: 50, textY: 5,
				action: function() {
					console.log("HELP");
				},
			},{		// Quit to Main Menu
				x: 0, y: 120,
				width: 191, height: 35,
				mouseState: 0,
				text: "SOON",
				textX: 50, textY: 5,
				action: function() {
					console.log("HELP");
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
			if(intersectTest(_mouse.x,_mouse.y,0,0, this.menu.x + this.menu.elements[i].x, this.menu.y + this.menu.elements[i].y, this.menu.elements[i].width, this.menu.elements[i].height)) {
				this.menu.activeIndex = i;
				if(_mouse.c1) this.menu.elements[this.menu.activeIndex].mouseState = 1;
			}
		}
	};

	render() {
		_context.globalAlpha = 1;

		_context.drawImage(this.backgroundImage, 0, 0, 1024, 768, 0,0,_screenWidth, _screenHeight);	// bg

		for(var i = 0; i < this.menu.elements.length; i++) {
			_context.drawImage(this.buttonImage, this.menu.x + this.menu.elements[i].x, this.menu.y + this.menu.elements[i].y);

			_context.drawImage( (this.menu.elements[i].mouseState == 0) ? _assets["art/intrface/menuup.frm"].frameInfo[0][0].img : _assets["art/intrface/menudown.frm"].frameInfo[0][0].img,
			this.menu.x + this.menu.elements[i].x + 14,
			this.menu.y + this.menu.elements[i].y + 4);

			bitmapFontRenderer.renderString(_assets["font4.aaf"], this.menu.elements[i].text ,
				this.menu.x + this.menu.elements[i].x + this.menu.elements[i].textX,
				this.menu.y + this.menu.elements[i].y + this.menu.elements[i].textY,
				(this.menu.elements[i].mouseState == 0) ? "#b89c28" : "#a99028");
		}
		_context.drawImage(_assets["art/intrface/stdarrow.frm"].frameInfo[0][0].img, _mouse.x, _mouse.y);		// cursor

	};

};
