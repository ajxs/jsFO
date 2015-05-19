"use strict";

IngameMenuState.prototype.menu = 0;

function IngameMenuState() {
	GameState.call(this);
	this.init();
}

IngameMenuState.prototype = new GameState();
IngameMenuState.prototype.constructor = IngameMenuState;

IngameMenuState.prototype.init = function() {

	this.menu = {
		
		x: ((_screenWidth/2)|0) - 82, y: ((_screenHeight/2)|0) - 108,		// set in main_setResolution()
		
		elements: [{		// Quit to Main Menu
			x: 13, y: 16,
			width: 137, height: 34,
			mouseState: 0,
			text: "INFO",
			textX: 0, textY: 0,
			action: function() {
				//console.log("Quit to main menu");
			},
			
		},{		// Quit to Main Menu
			x: 13, y: 54,
			width: 137, height: 34,
			mouseState: 0,
			text: "HELP",
			textX: 0, textY: 0,
			action: function() {
				//console.log("2");
			},
			
		},{		// Quit to Main Menu
			x: 13, y: 92,
			width: 137, height: 34,
			mouseState: 0,
			text: "ABOUT",
			textX: 0, textY: 0,
			action: function() {
				//console.log("3");
			},
			
		},{		// Quit to Main Menu
			x: 13, y: 130,
			width: 137, height: 34,
			mouseState: 0,
			text: "RETURN",
			textX: 0, textY: 0,
			action: function() {
				//console.log("4");
			},
			
		},{		// Quit to Main Menu
			x: 13, y: 168,
			width: 137, height: 34,
			mouseState: 0,
			text: "QUIT",
			textX: 0, textY: 0,
			action: function() {
				//console.log("4");
			},
			
		}],
		
		activeIndex: -1,
	};
}


IngameMenuState.prototype.input = function(e) {
	switch(e.type) {
		case "mousemove":
			break;

		case "keydown":
			if(_keyboardStates[27]) {
				main_ingameMenu_close();
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
	
	
}

IngameMenuState.prototype.update = function() {
	
	this.menu.activeIndex = -1;
	for(var i = 0; i < this.menu.elements.length; i++) {
		this.menu.elements[i].mouseState = 0;
		if(intersectTest(_mouse.x,_mouse.y,0,0, this.menu.x + this.menu.elements[i].x, this.menu.y + this.menu.elements[i].y, this.menu.elements[i].width, this.menu.elements[i].height)) {
			this.menu.activeIndex = i;
			if(_mouse.c1) this.menu.elements[this.menu.activeIndex].mouseState = 1;
		}			
	}
	
}


IngameMenuState.prototype.render = function() {	
	_context.globalAlpha = 1;
	
	_context.drawImage(_assets["art/intrface/opbase.frm"].frameInfo[0][0].img, this.menu.x, this.menu.y);	// bg
		
	for(var i = 0; i < this.menu.elements.length; i++) {
		_context.drawImage( (this.menu.elements[i].mouseState == 0) ? _assets["art/intrface/opbtnoff.frm"].frameInfo[0][0].img : _assets["art/intrface/opbtnon.frm"].frameInfo[0][0].img,
			this.menu.x + this.menu.elements[i].x, this.menu.y + this.menu.elements[i].y);
			
		bitmapFontRenderer.renderString(_assets["font3.aaf"], this.menu.elements[i].text ,
			this.menu.x + this.menu.elements[i].x + this.menu.elements[i].textX,
			this.menu.y + this.menu.elements[i].y + this.menu.elements[i].textY,
			(this.menu.elements[i].mouseState == 0) ? "#907824" : "#806814");
	}

	_context.drawImage(_assets["art/intrface/stdarrow.frm"].frameInfo[0][0].img, _mouse.x, _mouse.y);		// cursor
	
}