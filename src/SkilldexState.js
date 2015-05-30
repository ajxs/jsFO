"use strict";

function SkilldexState() {
	GameState.call(this);
}

SkilldexState.prototype = new GameState();
SkilldexState.prototype.constructor = SkilldexState;


SkilldexState.prototype.menu = {
	x: 0,		// set in main_setResolution
	y: 0,
	width: 185,		// fix all this, standardize
	height: 368,
	activeItem: -1,
	mouseState: 0,
	
	closeButton: {
		x: 48,
		y: 338,
		width: 15,
		height: 16,		
	},
	
	menuItems: [
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
	],
	
};

SkilldexState.prototype.init = function() {}

SkilldexState.prototype.action = function(action) {	
	main_closeSkilldex();	
	switch(action) {
		case 0:
			//sneak
			break;
		
	}
	
}



SkilldexState.prototype.input = function(e) {
	switch(e.type) {
		case "mousemove":
			break;
		case "keydown":
			if(_keyboardStates[27]) {
				main_closeSkilldex();
				return;
			}
			break;
		case "mousedown":
			this.menu.mouseState = 1;
			break;
		case "mouseup":
			this.menu.mouseState = 0;
			break;

		case "click":
			switch(this.menu.activeItem) {
				case -1: 
					break;
				case 0: 
					this.action("sneak");
					break;
				case 1: 
					this.action("lockpick");
					break;
				case "closeButton":
					main_closeSkilldex();
					this.menu.activeItem = -1;	// reset this so that it mouse event doesn't propagate through on reopen
					break;
			}
			break;
		case 'contextmenu':	// switch input modes on mouse2
			break;
	};	
}

SkilldexState.prototype.update = function() {
	this.menu.activeItem = -1;	
	if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.menu.x + this.menu.closeButton.x,
		this.menu.y + this.menu.closeButton.y,
		this.menu.closeButton.width,
		this.menu.closeButton.height)) {
			this.menu.activeItem = "closeButton";
			return;
		}

	for(var i = 0; i < this.menu.menuItems.length; i++) {
		if(intersectTest(_mouse.x,_mouse.y,0,0,
			this.menu.x + this.menu.menuItems[i].x,
			this.menu.y + this.menu.menuItems[i].y,
			this.menu.menuItems[i].width,
			this.menu.menuItems[i].height)) {
				this.menu.activeItem = i;
				return;
			}
	}
}

SkilldexState.prototype.render = function() {	
	_context.drawImage(_assets["art/intrface/skldxbox.frm"].frameInfo[0][0].img, this.menu.x, this.menu.y);	// interface
	
	bitmapFontRenderer.renderString(_assets["font3.aaf"], "SKILLDEX" ,
		this.menu.x + 55,
		this.menu.y + 14,
		"#907824");

	bitmapFontRenderer.renderString(_assets["font3.aaf"], "CANCEL" ,
		this.menu.x + 72,
		this.menu.y + 337,
		(this.menu.mouseState == 1 && this.menu.activeItem == "closeButton") ? "#806814" : "#907824");	

	
	_context.drawImage((this.menu.mouseState == 1 && this.menu.activeItem == "closeButton") ? _assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img : _assets["art/intrface/lilredup.frm"].frameInfo[0][0].img,
		this.menu.x + this.menu.closeButton.x,
		this.menu.y + this.menu.closeButton.y);
	
	for(var i = 0; i < this.menu.menuItems.length; i++) {
		_context.drawImage((this.menu.mouseState == 1 && this.menu.activeItem == i) ? _assets["art/intrface/skldxon.frm"].frameInfo[0][0].img : _assets["art/intrface/skldxoff.frm"].frameInfo[0][0].img,
			this.menu.x + this.menu.menuItems[i].x,
			this.menu.y + this.menu.menuItems[i].y);
			
		bitmapFontRenderer.renderString(_assets["font3.aaf"], this.menu.menuItems[i].text ,
			this.menu.x + this.menu.menuItems[i].x + this.menu.menuItems[i].textX,
			this.menu.y + this.menu.menuItems[i].y + this.menu.menuItems[i].textY,
			(this.menu.mouseState == 1 && this.menu.activeItem == i) ? "#806814" : "#907824");			
	}
	
	_context.drawImage(_assets["art/intrface/stdarrow.frm"].frameInfo[0][0].img, _mouse.x, _mouse.y);
	
}