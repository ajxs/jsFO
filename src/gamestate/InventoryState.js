"use strict";

class InventoryState extends GameState {
	constructor() {
		super();

		this.x = ((SCREEN_WIDTH / 2)|0) - 250;
		this.y = 0;

		this.playerAnimLastRotationTime = getTicks();

		this.activeItem = -1;
		this.mouseState = -1;

		this.playerAnimLastRotationTime = 0;
		this.playerAnimOrientation = 0;

		this.closeButton = {
			x: 437,
			y: 328,
			width: 15,
			height: 16,
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
					case "closeButton":
						main_gameStateFunction('closeInventory');
						this.activeItem = -1;	// reset this so that it mouse event doesn't propagate through on reopen
						break;
				}
				break;
			case 'contextmenu':	// switch input modes on mouse2
				break;
		};
	};

	update() {
		if(getTicks() - this.playerAnimLastRotationTime > 350) {
			if(this.playerAnimOrientation < 5) this.playerAnimOrientation++;
			else this.playerAnimOrientation = 0;
			this.playerAnimLastRotationTime = getTicks();
		}

		this.activeItem = -1;
		if(intersectTest(_mouse.x,_mouse.y,0,0,
			this.x + this.closeButton.x,
			this.y + this.closeButton.y,
			this.closeButton.width,
			this.closeButton.height)) {
				this.activeItem = "closeButton";
				return;
			}

	};

	render() {
		_context.globalAlpha = 1;
		_context.drawImage(_assets["art/intrface/invbox.frm"].frameInfo[0][0].img, this.x, this.y);	// bg

		_context.drawImage((this.activeItem == "closeButton" && this.mouseState == 1) ? _assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img : _assets["art/intrface/lilredup.frm"].frameInfo[0][0].img,
			this.x + this.closeButton.x, this.y + this.closeButton.y);	// bg

		_context.drawImage(mainState.player.anim.img.frameInfo[this.playerAnimOrientation][0].img,
			this.x + 190 + mainState.player.anim.img.shift[this.playerAnimOrientation].x, this.y + 45 + mainState.player.anim.img.shift[this.playerAnimOrientation].y);

		_context.drawImage(_assets["art/intrface/hand.frm"].frameInfo[0][0].img, _mouse.x, _mouse.y);		// cursor
	};

};
