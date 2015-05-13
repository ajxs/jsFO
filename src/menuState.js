"use strict";

function menuState() {
	gameState.call(this);

}

menuState.prototype = new gameState();
menuState.prototype.constructor = menuState;

menuState.prototype.init = function(_saveState) {		// use arguments here to pass saved state data.

	
}


menuState.prototype.input = function(e) { }

menuState.prototype.update = function() { }


menuState.prototype.render = function() {

	
}