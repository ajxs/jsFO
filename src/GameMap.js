"use strict";

function GameMap() {

};

GameMap.prototype = {
	constructor: GameMap,
	hexMap: 0,
		
	hexStatus: function(i,e) {	
		if(!this.hexMap[e][i]) return false;
		if(this.hexMap[e][i].blocked) return false;
		else return true;
	},
	
	

};