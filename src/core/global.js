/**
 * @file global.js
 * @author Anthony (ajxs [at] panoptic.online)
 * @brief Global variables.
 * Contains global variables used by the game.
 */

"use strict";

let _canvas;
let _context;

/**
 * Screen width and height constants.
 * These correspond to the main game window.
 */
const SCREEN_WIDTH = 640;
const SCREEN_HEIGHT = 480;

let clientBoundingRect;
let _mouse = {		// struct for mouse info
	x: 0,
	y: 0,
};

/**
 * This is a map of keycodes -> keystates.
 * This is set by the keyboard handler and  referenced by the game engine to determine what
 * keys are currently being pressed.
 */
let _keyboard = {};

/**
 * The main asset map.
 * This structure contains all of the assets, referenced by their pathname in the
 * game's DAT files.
 */
let _assets = {};

/**
 * The current FPS tick count.
 */
let fps_currentTime;

/**
 * The stack of active game states.
 * These are rendered and updated sequentially from top to bottom.
 */
let activeGameStates = [];

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


/**
 * Gets the current ticks.
 * This is the tick count since the game began.
 * @returns The curent tick count.
 */
function getTicks()
{
	return fps_currentTime;
}

const isObject = o => o !== null && typeof o === 'object';
const isFunction = f => f && ({}).toString.call(f) === '[object Function]';

/**
 * Returns object type from typeID
 * @param {*} _id The typeID to check.
 * @returns A string indicating the object type, or false if none matched.
 */
function getObjectType(_id)
{
	return ["items","critters","scenery","walls","tiles","misc"][_id] || false;
}
