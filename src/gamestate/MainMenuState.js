"use strict";



class MainMenuState extends GameState {
	constructor() {
		super();

		this.backgroundImage = document.getElementById('MainMenuState_bg');
		this.buttonImage = document.getElementById('MainMenuState_btn');		//@TODO: FIX

		this.menu = new Interface('jsfdata/interface/mainMenu.json');

	};

	input(e) {
		switch(e.type) {
			case "mousedown":
				break;
			case "mouseup":
				this.menu.update();
				main_gameStateFunction(this.menu.clickHandler());
				break;
			case "click":
				break;
			default:
				return;
		};
	};

	update() {
		this.menu.update();
	};

	render() {
		_context.drawImage(this.backgroundImage, 0, 0, 1024, 768, 0,0,SCREEN_WIDTH, SCREEN_HEIGHT);	// bg

		this.menu.elements.forEach((element, index) => {
			_context.drawImage(this.buttonImage, this.menu.x + element.x, this.menu.y + element.y);

			blitFRM((this.menu.mouseState == 1 && this.menu.activeItem == index) ? _assets["art/intrface/menudown.frm"] : _assets["art/intrface/menuup.frm"],
				_context,
				this.menu.x + element.x + 14,
				this.menu.y + element.y + 4);

			blitFontString(_assets["font4.aaf"],
				_context,
				element.text ,
				this.menu.x + element.x + element.textX,
				this.menu.y + element.y + element.textY,
				(this.menu.mouseState == 1 && this.menu.activeItem == index) ? "#a99028": "#b89c28");

		});

		blitFRM(_assets["art/intrface/stdarrow.frm"],		// cursor
			_context,
			_mouse.x,
			_mouse.y);
	};

};
