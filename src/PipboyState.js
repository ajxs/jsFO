"use strict";

class PipboyState extends GameState {
	constructor() {
		super();

		this.x = 0;
		this.y = 0;
		this.activeScreen = "status";

		this.mapX = 280;
		this.mapY = 80;

		this.interface = new Interface('jsfdata/interface/pipBoyInterface.json');

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
				break;
			case "click":		//@TODO: figure out click/mouseup
				this.interface.update();
				switch(this.interface.clickHandler()) {
					case "status":
						this.activeScreen = "status";
						break;
					case "archive":
						this.activeScreen = "archive";
						break;
					case "map":
						this.activeScreen = "map";
						break;
					case "close":
						console.log('huh');
						main_gameStateFunction('closePipBoy');
						break;
				}

				break;
			case 'contextmenu':
				break;
		};
	};

	update() {
		if(MOUSE.c1) this.interface.mouseState = 1;
		else this.interface.mouseState = 0;
		this.interface.update();
	};

	render() {
		_context.globalAlpha = 1;
		blitFRM(_assets["art/intrface/pip.frm"],
			_context,
			this.x,
			this.y);

		this.interface.elements.forEach((element, index) => {
			if(this.interface.mouseState == 1 && this.interface.activeItem == index) {
				blitFRM(_assets["art/intrface/lilreddn.frm"],
					_context,
					this.interface.x + element.x,
					this.interface.y + element.y);
			}
		});

		switch(this.activeScreen) {
			case "map":
				break;
			case "status":
				break;
			case "archive":
				break;
		}

		blitFRM(_assets["art/intrface/stdarrow.frm"],		// cursor
			_context,
			MOUSE.x,
			MOUSE.y);

	};

};
