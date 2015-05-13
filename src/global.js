var _canvas;		// global vars
var _context;

var _brightmap;

var callFrame = browser_getCallFrame();

var _screenWidth = 1024, _screenHeight = 768;
//var _screenWidth = 640, _screenHeight = 480;

var _mouse = {		// struct for mouse info
	x: 0,	
	y: 0,
	c1: false,
	c2: false
};	


var _keyboardStates = [];	// array to hold keycode states

var _debug = {
	remoteLoading: true,
	
	enableKeyboardScroll: true,
	
};


var _assets = {};		// main asset hashtable

var fps_timeStart;
var fps_timeCurrent;
var fps_timeLength;
var fps_timeFrameCount = 0;
var fps_framesPerSecond;

var _context_clearcolour = "#000000";

var stateQ = [];		// states 
var stateQ_current;

var loadState;
var mainState;
var ingameMenuState;
var menuState;


function getTicks() {
	return fps_timeCurrent;
}

function isObject(_o) {
	if(_o !== null && typeof _o === 'object') return true;
	else return false;
}

function isFunction(functionToCheck) {
	var getType = {};
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}


function drawHex(_x,_y,_text,_col) {

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
	
	_context.font="8px Georgia";
	_context.fillStyle = _col;
	_context.fillText(_text,_x+4,_y+10);
}



function xhr(_file,_type,_callback,_progressHandler,_failHandler) {
	
	var xhr = new XMLHttpRequest();
	
	var updateProgress = function(e) {
		if(isFunction(_progressHandler)) _progressHandler(xhr.response);
	}
	
	var transferComplete = function(e) {
		if(isFunction(_callback)) _callback(xhr.response); // trigger callback
	}
	
	var transferFailed = function(e) {
		if(isFunction(_failHandler)) _failHandler(xhr.response);
		console.log("xhr: transfer failed");
	}
	
	var transferCanceled = function(e) {
		console.log("xhr: transfer canceled");
	}
	
	xhr.open('GET', _file, true);
	xhr.responseType = _type;

	xhr.addEventListener("progress", updateProgress, false);
	xhr.addEventListener("load", transferComplete, false);
	xhr.addEventListener("error", transferFailed, false);
	xhr.addEventListener("abort", transferCanceled, false);

	
	xhr.send();
}