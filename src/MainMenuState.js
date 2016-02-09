"use strict";



class MainMenuState extends GameState {
	constructor() {
		super();

		this.backgroundImage = document.getElementById('MainMenuState_bg');
		this.buttonImage = document.getElementById('MainMenuState_btn');

		this.menu = new Interface('jsfdata/interface/mainMenu.json');

		this.menu.x = (SCREEN_WIDTH*0.05)|0;
		this.menu.y = (SCREEN_WIDTH*0.185)|0;		// set in main_setResolution()

	};

	input(e) {
		switch(e.type) {
			case "mousemove":
				break;
			case "keydown":
				break;
			case "mousedown":
				break;
			case "mouseup":
				this.menu.update();
				main_gameStateFunction(this.menu.clickHandler());

				break;
			case "click":
				break;
			case 'contextmenu':	// switch input modes on mouse2
				break;
		};
	};

	update() {
		this.menu.update();
		if(MOUSE.c1) this.menu.mouseState = 1;
		else this.menu.mouseState = 0;
	};

	render() {
		_context.globalAlpha = 1;

		_context.drawImage(this.backgroundImage, 0, 0, 1024, 768, 0,0,SCREEN_WIDTH, SCREEN_HEIGHT);	// bg

		let activeState;
		this.menu.elements.forEach((element, index) => {
			_context.drawImage(this.buttonImage, this.menu.x + element.x, this.menu.y + element.y);

			activeState = (this.menu.mouseState == 1 && this.menu.activeItem == index);
			blitFRM(activeState ? _assets["art/intrface/menudown.frm"] : _assets["art/intrface/menuup.frm"],
				_context,
				this.menu.x + element.x + 14,
				this.menu.y + element.y + 4);

				bitmapFontRenderer.renderString(_assets["font4.aaf"],
					element.text ,
					this.menu.x + element.x + element.textX,
					this.menu.y + element.y + element.textY,
					activeState ? "#a99028": "#b89c28");

		});

		blitFRM(_assets["art/intrface/stdarrow.frm"],		// cursor
			_context,
			MOUSE.x,
			MOUSE.y);
	};

};
