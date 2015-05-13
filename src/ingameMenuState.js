"use strict";

ingameMenuState.prototype.menu = 0;

function ingameMenuState() {
	gameState.call(this);
	this.init();
}

ingameMenuState.prototype = new gameState();
ingameMenuState.prototype.constructor = ingameMenuState;

ingameMenuState.prototype.init = function() {

	this.menu = {
		
		x: ((_screenWidth/2)|0) - 82, y: ((_screenHeight/2)|0) - 108,		// set in main_setResolution()
		
		elements: [{		// Quit to Main Menu
			x: 13, y: 16,
			width: 137, height: 34,
			mouseState: 0,
			text: "INFO",
			textX: 0, textY: 0,
			action: function() {
				console.log("Quit to main menu");
			},
			
		},{		// Quit to Main Menu
			x: 13, y: 54,
			width: 137, height: 34,
			mouseState: 0,
			text: "HELP",
			textX: 0, textY: 0,
			action: function() {
				console.log("2");
			},
			
		},{		// Quit to Main Menu
			x: 13, y: 92,
			width: 137, height: 34,
			mouseState: 0,
			text: "ABOUT",
			textX: 0, textY: 0,
			action: function() {
				console.log("3");
			},
			
		},{		// Quit to Main Menu
			x: 13, y: 130,
			width: 137, height: 34,
			mouseState: 0,
			text: "RETURN",
			textX: 0, textY: 0,
			action: function() {
				console.log("4");
			},
			
		},{		// Quit to Main Menu
			x: 13, y: 168,
			width: 137, height: 34,
			mouseState: 0,
			text: "QUIT",
			textX: 0, textY: 0,
			action: function() {
				console.log("4");
			},
			
		}],
		
		activeIndex: -1,
		
		addElement:function(_uiItem) {
			this.elements.push(_uiItem);
		},
		
		mouseCheck:function(_x,_y) {
			for(var i = 0; i < this.elements.length; i++) {
				if(_x > this.x + this.elements[i].x && _x < this.x + this.elements[i].x + this.elements[i].width) {
					if(_y > this.y + this.elements[i].y && _y < this.y + this.elements[i].y + this.elements[i].height) return i;
				}
			}
			return -1;	// no element
		},
	};
}


ingameMenuState.prototype.input = function(e) {
	if(e.type == 'keydown') {
		if(_keyboardStates[27]) {
			main_ingameMenu_close();
			return;
		}
	}
	
	this.menu.activeIndex = this.menu.mouseCheck(_mouse.x,_mouse.y);
	if(this.menu.activeIndex != -1) {
		this.menu.elements[this.menu.activeIndex].mouseState = 1;
	}
	
	if(e.type == 'mousedown') {
		if(this.menu.activeIndex != -1) {
			this.menu.elements[this.menu.activeIndex].mouseState = 2;
		}
	} else if(e.type == 'mouseup') {
		if(this.menu.activeIndex != -1) {
			if(isFunction(this.menu.elements[this.menu.activeIndex].action)) {
				this.menu.elements[this.menu.activeIndex].action();
				return;
			}
			this.menu.elements[this.menu.activeIndex].mouseState = 1;
		}
	}	
	
}

ingameMenuState.prototype.update = function() {}


ingameMenuState.prototype.render = function() {	
	_context.globalAlpha = 1;
	
	_context.drawImage(_assets["art/intrface/opbase.frm"].frameInfo[0][0].img, this.menu.x, this.menu.y);	// bg
		
	for(var i = 0; i < this.menu.elements.length; i++) {
		switch(this.menu.elements[i].mouseState) {
			case 0:
			case 1:
				_context.drawImage(_assets["art/intrface/opbtnoff.frm"].frameInfo[0][0].img, this.menu.x + this.menu.elements[i].x, this.menu.y + this.menu.elements[i].y);
				bitmapFontRenderer.renderString(_assets["font3.aaf"], this.menu.elements[i].text ,
					this.menu.x + this.menu.elements[i].x + this.menu.elements[i].textX,
					this.menu.y + this.menu.elements[i].y + this.menu.elements[i].textY, "#907824");
				break;
			case 2:
				_context.drawImage(_assets["art/intrface/opbtnon.frm"].frameInfo[0][0].img, this.menu.x + this.menu.elements[i].x, this.menu.y + this.menu.elements[i].y);
				bitmapFontRenderer.renderString(_assets["font3.aaf"], this.menu.elements[i].text ,
					this.menu.x + this.menu.elements[i].x + this.menu.elements[i].textX,
					this.menu.y + this.menu.elements[i].y + this.menu.elements[i].textY, "#806814");
				break;			
		}
	}

	_context.drawImage(_assets["art/intrface/stdarrow.frm"].frameInfo[0][0].img, _mouse.x, _mouse.y);		// cursor
	
}