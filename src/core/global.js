'use strict';

let _canvas;		// global vars
let _context;

const CALLFRAME = browser_getCallFrame();
const SCREEN_WIDTH = 640, SCREEN_HEIGHT = 480;

let clientBoundingRect;
let _mouse = {		// struct for mouse info
	x: 0,
	y: 0,
};

let _keyboard = {};	// array to hold keycode states


let _assets = {};		// main asset hashtable


let fps_currentTime;

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


const getTicks = () => fps_currentTime;
const isObject = o => o !== null && typeof o === 'object';
const isFunction = f => f && ({}).toString.call(f) === '[object Function]';

function getObjectType(_id) {		// returns type from typeID
	return ["items","critters","scenery","walls","tiles","misc"][_id] || false;
};
