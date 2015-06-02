"use strict";

function MapScreenState() {
	GameState.call(this);
}

MapScreenState.prototype = new GameState();
MapScreenState.prototype.constructor = MapScreenState;

MapScreenState.prototype.activeItem = -1;
MapScreenState.prototype.mouseState = 0;
MapScreenState.prototype.x = 0;
MapScreenState.prototype.y = 0;


MapScreenState.prototype.mapX = 40;
MapScreenState.prototype.mapY = 40;
MapScreenState.prototype.mapWidth = 400;
MapScreenState.prototype.mapHeight = 400;


MapScreenState.prototype.switchState = "low";



MapScreenState.prototype.closeButton = {
	x: 277, y: 454,
	width: 15, height: 16,		
};
MapScreenState.prototype.hiSwitch = {
	x: 467, y: 322,
	width: 32, height: 60,		
};


MapScreenState.prototype.init = function() {}

MapScreenState.prototype.input = function(e) {
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
					main_closeMap();
					this.activeItem = -1;	// reset this so that it mouse event doesn't propagate through on reopen
					break;
				case "hiSwitch":
					if(this.switchState == "low") this.switchState = "high";
					else if(this.switchState == "high") this.switchState = "low";
					this.activeItem = -1;	// reset this so that it mouse event doesn't propagate through on reopen
					break;
			}
			break;
		case 'contextmenu':	// switch input modes on mouse2
			break;
	};	
}

MapScreenState.prototype.update = function() {
	this.activeItem = -1;
	if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.x + this.closeButton.x, this.y + this.closeButton.y,
		this.closeButton.width, this.closeButton.height)) {
			this.activeItem = "closeButton";
	} else if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.x + this.hiSwitch.x, this.y + this.hiSwitch.y,
		this.hiSwitch.width, this.hiSwitch.height)) {
			this.activeItem = "hiSwitch";
	}

}

MapScreenState.prototype.render = function() {	
	_context.globalAlpha = 1;
	_context.drawImage(_assets["art/intrface/automap.frm"].frameInfo[0][0].img, this.x, this.y);	// bg

	if(this.activeItem == "closeButton" && this.mouseState == 1) _context.drawImage(_assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img, this.x + this.closeButton.x, this.y + this.closeButton.y);
	
	if(this.switchState == "high") _context.drawImage(_assets["art/intrface/autoup.frm"].frameInfo[0][0].img, this.x + 457, this.y + 339);
	
	for(var i = 0; i < mainState.mapObjects[mainState.player.currentElevation].length; i++) {
		var h = mainState.mapObjects[mainState.player.currentElevation][i].hexPosition;
		var cx = h%200;
		var cy = (h/200)|0;
		var type = mainState.getObjectType(mainState.mapObjects[mainState.player.currentElevation][i].objectTypeID);
		
		if(this.switchState == "high") {
			if(type == "scenery") {
				_context.fillStyle = "#006c00";
				_context.fillRect(this.mapX + (this.mapWidth - (cx*2)) , this.mapY + (cy*2),2,1);				
			}			
		}

		if(type == "walls") {
			_context.fillStyle = "#00FF00";
			_context.fillRect(this.mapX + (this.mapWidth - (cx*2)) , this.mapY + (cy*2),2,1);
		}

		if(mainState.mapObjects[mainState.player.currentElevation][i] == mainState.player) {
			_context.fillStyle = "#FF0000";
			_context.fillRect(this.mapX + (this.mapWidth - (cx*2))-1, this.mapY + (cy*2),3,1);		
			_context.fillRect(this.mapX + (this.mapWidth - (cx*2)), this.mapY + (cy*2)-1,1,3);		
			
		}
		
	}		
	
	
	_context.drawImage(_assets["art/intrface/stdarrow.frm"].frameInfo[0][0].img, _mouse.x, _mouse.y);		// cursor	
}
