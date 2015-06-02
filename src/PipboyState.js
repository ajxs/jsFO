"use strict";

function PipboyState() {
	GameState.call(this);
}

PipboyState.prototype = new GameState();
PipboyState.prototype.constructor = PipboyState;

PipboyState.prototype.activeItem = -1;
PipboyState.prototype.mouseState = 0;
PipboyState.prototype.x = 0;
PipboyState.prototype.y = 0;
PipboyState.prototype.activeScreen = "status";

PipboyState.prototype.mapX = 280;
PipboyState.prototype.mapY = 80;


PipboyState.prototype.statusButton = {
	x: 53, y: 340,
	width: 15, height: 16,
};

PipboyState.prototype.archiveButton = {
	x: 53, y: 423,
	width: 15, height: 16,	
};

PipboyState.prototype.mapButton = {
	x: 53, y: 394,
	width: 15, height: 16,		
};

PipboyState.prototype.closeButton = {
	x: 53, y: 449,
	width: 15, height: 16,		
};


PipboyState.prototype.init = function() {}

PipboyState.prototype.input = function(e) {
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
				case "statusButton":
					this.activeScreen = "status";
					this.activeItem = -1;	// reset this so that it mouse event doesn't propagate through on reopen
					break;
				case "archiveButton":
					this.activeScreen = "archive";
					this.activeItem = -1;	// reset this so that it mouse event doesn't propagate through on reopen
					break;
				case "mapButton":
					this.activeScreen = "map";
					this.activeItem = -1;	// reset this so that it mouse event doesn't propagate through on reopen
					break;
				case "closeButton":
					main_closePipboy();
					this.activeItem = -1;	// reset this so that it mouse event doesn't propagate through on reopen
					break;
			}
			break;
		case 'contextmenu':	// switch input modes on mouse2
			break;
	};	
}

PipboyState.prototype.update = function() {
	this.activeItem = -1;
	if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.x + this.statusButton.x, this.y + this.statusButton.y,
		this.statusButton.width, this.statusButton.height)) {
			this.activeItem = "statusButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.x + this.archiveButton.x, this.y + this.archiveButton.y,
		this.archiveButton.width, this.archiveButton.height)) {
			this.activeItem = "archiveButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.x + this.mapButton.x, this.y + this.mapButton.y,
		this.mapButton.width, this.mapButton.height)) {
			this.activeItem = "mapButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.x + this.closeButton.x, this.y + this.closeButton.y,
		this.closeButton.width, this.closeButton.height)) {
			this.activeItem = "closeButton";
	}

}

PipboyState.prototype.render = function() {	
	_context.globalAlpha = 1;
	_context.drawImage(_assets["art/intrface/pip.frm"].frameInfo[0][0].img, this.x, this.y);	// bg

	if(this.activeItem == "statusButton" && this.mouseState == 1) _context.drawImage(_assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img, this.x + this.statusButton.x, this.y + this.statusButton.y);
	if(this.activeItem == "archiveButton" && this.mouseState == 1) _context.drawImage(_assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img, this.x + this.archiveButton.x, this.y + this.archiveButton.y);
	if(this.activeItem == "mapButton" && this.mouseState == 1) _context.drawImage(_assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img, this.x + this.mapButton.x, this.y + this.mapButton.y);
	if(this.activeItem == "closeButton" && this.mouseState == 1) _context.drawImage(_assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img, this.x + this.closeButton.x, this.y + this.closeButton.y);
	
	switch(this.activeScreen) {
		case "map":
			break;
		case "status":
			break;	
		case "archive":
			break;		
	}
	
	_context.drawImage(_assets["art/intrface/stdarrow.frm"].frameInfo[0][0].img, _mouse.x, _mouse.y);		// cursor	
}
