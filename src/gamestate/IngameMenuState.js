"use strict";

class IngameMenuState extends GameState {
	constructor() {
		super();
		this.interface = new Interface('jsfdata/interface/inGameMenuInterface.json');
	};

	input(e) {
		switch(e.type) {
			case "keydown":
				if(_keyboard['Escape']) {
					main_gameStateFunction('closeIngameMenu');
					return;
				}
				break;
			case "mousedown":
				break;
			case "mouseup":
				switch(this.interface.clickHandler()) {
					case "return":
						main_gameStateFunction("closeIngameMenu");
						break;
					default:
						break;
				};
				break;
		};
	};

	update() {
		this.interface.update();
	};

	render() {
		blitFRM(_assets["art/intrface/opbase.frm"],
			_context,
			this.interface.x,
			this.interface.y);

		for(var i = 0; i < this.interface.elements.length; i++) {
			blitFRM((this.interface.activeItem == i && this.interface.mouseState) ? _assets["art/intrface/opbtnon.frm"] : _assets["art/intrface/opbtnoff.frm"],
				_context,
				this.interface.x + this.interface.elements[i].x,
				this.interface.y + this.interface.elements[i].y);

			blitFontString(_assets["font3.aaf"],
				_context,
			 	this.interface.elements[i].text ,
				this.interface.x + this.interface.elements[i].x + this.interface.elements[i].textX,
				this.interface.y + this.interface.elements[i].y + this.interface.elements[i].textY,
				(this.interface.activeItem == i && this.interface.mouseState) ? "#907824" : "#806814");
		}

		blitFRM(_assets["art/intrface/stdarrow.frm"],
			_context,
			_mouse.x,
			_mouse.y);
	};

};
