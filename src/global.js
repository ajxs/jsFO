'use strict';

let _canvas;		// global vars
let _context;

const CALLFRAME = browser_getCallFrame();
const SCREEN_WIDTH = 640, SCREEN_HEIGHT = 480;
const DEBUG_FLAGS = {
	drawSpecialHexes: false,
};

let clientBoundingRect;
let _mouse = {		// struct for mouse info
	x: 0,
	y: 0,
};

let _keyboard = [];	// array to hold keycode states

let _assets = {};		// main asset map


let currentTime;

let activeGameStates = [];		// state stack

let loadState;
let mainState;
let mainLoadState;
let contextMenuState;
let inventoryState;
let skilldexState;
let ingameMenuState;
let mainMenuState;
let characterScreenState;
let pipboyState;
let mapScreenState;

function isObject(_o) {
	if(_o !== null && typeof _o === 'object') return true;
	else return false;
};

function isFunction(functionToCheck) {
	let getType = {};
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

function intersectTest(ax,ay,aw,ah, bx,by,bw,bh) {
	return !(bx > (ax+aw)
		|| (bx+bw) < ax
		|| by > (ay+ah)
		|| (by+bh) < ay);
};


function drawHex(_x,_y,_col = "#00FF00", _text = null) {
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

function drawTile(_x,_y,_col = "#00FF00", _text = null) {
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

function getObjectType(_id) {		// returns type from typeID
	return ["items","critters","scenery","walls","tiles","misc"][_id] || null;
};
