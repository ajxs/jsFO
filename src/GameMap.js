"use strict";

class GameMap {
	constructor() {
		this.hexMap = 0;
	};

	hexStatus(i,e) {
		return (this.hexMap[e][i] && !this.hexMap[e][i].blocked);
	};
};
