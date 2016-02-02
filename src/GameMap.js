"use strict";

class GameMap {
	constructor() {
		this.hexMap = 0;
	};

	hexStatus(i,e) {
		if(!this.hexMap[e][i]) return false;
		if(this.hexMap[e][i].blocked) return false;
		else return true;
	};
};
