'use strict';


const intersectTest = (ax,ay,aw,ah, bx,by,bw,bh) => {
	return !(bx > (ax+aw) ||
	(bx+bw) < ax ||
	by > (ay+ah) ||
	(by+bh) < ay);
};


function drawHex(_x,_y,_text,_col = "#00FF00") {
	_context.beginPath();
	_context.moveTo(_x+16,_y);
	_context.lineTo(_x+32,_y+4);
	_context.lineTo(_x+32,_y+12);
	_context.lineTo(_x+16,_y+16);
	_context.lineTo(_x,_y+12);
	_context.lineTo(_x,_y+4);
	_context.lineTo(_x+16,_y);

	_context.closePath();
	_context.lineWidth = 1;
	_context.strokeStyle = _col;
	_context.stroke();

	if(_text) {
		_context.font="8px Georgia";
		_context.fillStyle = _col;
		_context.fillText(_text,_x+4,_y+10);
	}
};

function drawTile(_x,_y,_text,_col =  "#00FF00") {
	_context.beginPath();
	_context.moveTo(_x,_y+12);
	_context.lineTo(_x+48,_y);
	_context.lineTo(_x+80,_y+24);
	_context.lineTo(_x+32,_y+36);
	_context.lineTo(_x,_y+12);

	_context.closePath();
	_context.lineWidth = 1;
	_context.strokeStyle = _col;
	_context.stroke();

	if(_text) {
		_context.font="8px Georgia";
		_context.fillStyle = _col;
		_context.fillText(_text,_x+4,_y+10);
	}
};

const mapGeometry = {	// struct for map geometry lets/functions
	/* note: Hex and Tile sizes are hardcoded as:
	hex - w: 32, h: 16
	tile - w: 80: h: 32 */

	m_width: 100,	// nTiles in row
	h_width: 200,
	m_roofHeight: 96,
	m_transform: {	// offsets to make hexes and maptiles align
		x: 48, y: -3,		//@TODO: Investigate
	},


	h2s(i) {	// hex index to screen-space
		let q = (i%this.h_width)|0, r = (i/this.h_width)|0;
		let px = 0 - q*32 + r*16, py = r*12;
		let qx = ((q/2)|0)*16, qy = ((q/2)|0)*12;

		return {
			x: px + qx,
			y: py + qy,
		}
	},

	c2s(i) {	// maptile index to screen-space
		let tCol = i%this.m_width, tRow = (i/this.m_width)|0;
		return {
			x: 0 - this.m_transform.x - (tCol*48) + (tRow*32),		// map origin { x: 0, y: 0} is at upper right.
			y: this.m_transform.y + tCol*12 + (tRow*24),
		}
	},

	s2h(mx,my) {	// screen-space to hex index conversion
		if(mx < 0) mx -= 32;    // compensate for -0 effect
		mx *= -1;

		let hCol = (mx/32)|0, hRow = (my/12)|0;
		if(hRow >0) hCol += Math.abs(hRow/2)|0;
		hRow -= (hCol/2)|0;

		return ((hRow*this.h_width)+hCol);

	},

	findAdj(i) {	// returns array of indexes of hexes adjacent to index
		return new Array(
			(i%2) ? i - (this.h_width+1) : i-1,
			(i%2) ? i-1 : i + (this.h_width-1),
			i+this.h_width,
			(i%2) ? i+1 : i + (this.h_width+1),
			(i%2) ? i-(this.h_width-1) : i+1,
			i-this.h_width);
	},

	findOrientation(_origin, _dest) {		// finds orientation between two adjacent hexes
		if(_origin == _dest) {
			console.log("MainState: findOrientation error: origin and dest identical");
			return 0;
		}
		let orientation = this.findAdj(_origin).indexOf(_dest);
		if(orientation == -1) {
			console.log("MainState: findOrientation error: -1");
			return 0;
		}
		return orientation;
	},

	/* default function used for heuristic score in pathfinding algorith,
	can be replaced with better one as needed */

	hDistance(_a,_b) {	// pythagorean distance
		let ha = this.h2s(_a);
		let hb = this.h2s(_b);

		let dx = Math.abs(hb.x - ha.x);
		let dy = Math.abs(hb.y - ha.y);
		return Math.sqrt((dx*dx)+(dy*dy));

	}

};
