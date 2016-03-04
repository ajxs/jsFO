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
			case "mousedown":
				this.interface.mouseState = 1;
				break;
			case "mouseup":
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
						main_gameStateFunction('closePipBoy');
						break;
				}

				this.interface.mouseState = 0;
				break;
			case "click":		//@TODO: figure out click/mouseup
				break;
			default:
				return;
		};
	};

	update() {
		this.interface.update();
	};

	render() {
		_context.globalAlpha = 1;
		blitFRM(_assets["art/intrface/pip.frm"],
			_context,
			this.x,
			this.y);

		if(this.interface.mouseState == 1 && this.interface.activeItem != -1) {
			blitFRM(_assets["art/intrface/lilreddn.frm"],
				_context,
				this.interface.x + this.interface.elements[this.interface.activeItem].x,
				this.interface.y + this.interface.elements[this.interface.activeItem].y);
		}

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
			_mouse.x,
			_mouse.y);

	};

};
