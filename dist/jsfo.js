/**
 * @file assets.js
 * @author Anthony (ajxs [at] panoptic.online)
 * @brief Asset functionality.
 * Constains functions for working with ingame assets.
 */
"use strict";
/**
 * Creates an FRM asset from its JSON encoded format.
 * This creates the image data from the binary encoded image data by creating an HTML
 * `img` element, and setting it's `src` attribute to the encoded image data.
 * @param {*} obj The game asset JSON data to parse.
 * @returns The parsed asset.
 */

function asset_createFRMFromJSON(obj) {
  let frmItem = obj;
  frmItem.img = document.createElement('img');
  frmItem.img.src = obj.imgdata;
  return frmItem;
}
/**
 * Creates a font asset from its JSON encoded format.
 * This creates the image data from the binary encoded image data by creating an HTML
 * `img` element, and setting it's `src` attribute to the encoded image data.
 * @param {*} obj The game asset JSON data to parse.
 * @returns The parsed asset.
 */


function asset_createFontFromJSON(obj) {
  let fontItem = obj;
  fontItem.img = document.createElement('img');
  fontItem.img.src = fontItem.imgdata;
  return fontItem;
}
/**
 * Parses an LST game asset.
 * @param {*} obj The game asset JSON data to parse.
 * @returns The parsed asset.
 */


function asset_createLSTfromJSON(obj) {
  let lstItem = new Array(obj.data.length);

  for (let i = 0; i < obj.data.length; i++) {
    lstItem[i] = {
      data: obj.data[i],
      ptr: 0
    };
  }

  return lstItem;
}
/**
 * This function parses the `loadData` object, creating the ingame assets from the raw
 * JSON asset data.
 * This function chooses the correct handler function to translate the asset data for each
 * ingame asset in the load data based upon its type.
 * This function is called when a level is loaded.
 * @param {*} loadData The data to parse.
 */


function asset_parseLoadData(loadData) {
  for (let key in loadData) {
    switch (loadData[key].type) {
      case "frm":
        _assets[key] = asset_createFRMFromJSON(loadData[key]);
        break;

      case "aaf":
        _assets[key] = asset_createFontFromJSON(loadData[key]);
        break;

      case "fon":
        _assets[key] = asset_createFontFromJSON(loadData[key]);
        break;

      case "lst":
        _assets[key] = asset_createLSTfromJSON(loadData[key]);
        break;

      case "msg":
      case "int":
      case "txt":
      case "pro":
      default:
        _assets[key] = loadData[key];
        break;
    }
  }
}
/**
 * @file browser.js
 * @author Anthony (ajxs [at] panoptic.online)
 * @brief Browser interface functionality.
 * Contains functions which are related to interfacing with the web browser.
 */
"use strict";
/**
 * Returns user-agent info.
 * Instructs the application as to the browser that it is running in.
 * @returns An object containing the user-agent info.
 */

function browser_getInfo() {
  let ua = navigator.userAgent,
      tem;
  let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return {
      name: 'IE ',
      version: tem[1] || ''
    };
  }

  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR\/(\d+)/);

    if (tem != null) {
      return {
        name: 'Opera',
        version: tem[1]
      };
    }
  }

  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];

  if ((tem = ua.match(/version\/(\d+)/i)) != null) {
    M.splice(1, 1, tem[1]);
  }

  return {
    name: M[0],
    version: M[1]
  };
}
/**
 * Tests the browser for compatibility.
 * @returns A boolean indicating compatibility for the app.
 */


function browser_test() {
  const info = browser_getInfo();
  let testFeatures = [];
  testFeatures.push(document.createElement("canvas").getContext("2d"));
  testFeatures.push(new XMLHttpRequest());
  testFeatures.push(Array.prototype.map);
  testFeatures.forEach(element => {
    return element || false;
  });
  return true;
}
/**
 * @file debug.js
 * @author Anthony (ajxs [at] panoptic.online)
 * @brief Debug flags.
 * Contains debug flags which are checked by various processes within the app.
 */
"use strict";

const DEBUG_FLAGS = {
  drawSpecialHexes: false
};
"use strict";

class GameState {
  constructor() {
    this.statePause = false;
  }

  init() {}

  input() {}

  update() {}

  render() {}

}

;
/**
 * @file geometry.js
 * @author Anthony (ajxs [at] panoptic.online)
 * @brief Geometry constants and functionality.
 * Constains functions and constants for working with ingame geometry.
 * note: Hex and Tile sizes are hardcoded as:
 * hex - w: 32, h: 16
 * tile - w: 80: h: 32
 */
"use strict";
/** The number of square tiles in a map row. */

const map_tile_width = 100;
/** The number of hexes in a map row. */

const map_hex_width = 200;
/** The pixel height of each vertical level. */

const map_roof_height = 96;
/** offsets to make hexes and maptiles align. */

const map_alignment_offset = {
  x: 48,
  y: -3
};
/**
 * Tests for the intersection of two rectangles.
 * @param {number} ax - The x coordinate of the first rect.
 * @param {number} ay - The y coordinate of the first rect.
 * @param {number} aw - The width of the first rect.
 * @param {number} ah - The height of the first rect.
 * @param {number} bx - The x coordinate of the second rect.
 * @param {number} by - The y coordinate of the second rect.
 * @param {number} bw - The width of the second rect.
 * @param {number} bh - The height of the second rect.
 * @returns A boolean indicating whether or not these rectangles intersect.
 */

function intersectTest(ax, ay, aw, ah, bx, by, bw, bh) {
  return !(bx > ax + aw || bx + bw < ax || by > ay + ah || by + bh < ay);
}
/**
 * Draws a hex outline on screen.
 * @param {number} _x - The x coordinate to draw the hex at.
 * @param {number} _y - The y coordinate to draw the hex at.
 * @param {string} [_text] - Optional text to draw within the hex.
 * @param {string} [_col] - The colour for the hex outline.
 */


function drawHex(_x, _y, _text = null, _col = "#00FF00") {
  _context.beginPath();

  _context.moveTo(_x + 16, _y);

  _context.lineTo(_x + 32, _y + 4);

  _context.lineTo(_x + 32, _y + 12);

  _context.lineTo(_x + 16, _y + 16);

  _context.lineTo(_x, _y + 12);

  _context.lineTo(_x, _y + 4);

  _context.lineTo(_x + 16, _y);

  _context.closePath();

  _context.lineWidth = 1;
  _context.strokeStyle = _col;

  _context.stroke();

  if (_text) {
    _context.font = "8px Georgia";
    _context.fillStyle = _col;

    _context.fillText(_text, _x + 4, _y + 10);
  }
}
/**
 * Draws a tile outline on screen.
 * @param {number} _x - The x coordinate to draw the tile at.
 * @param {number} _y - The y coordinate to draw the tile at.
 * @param {string} [_text] - Optional text to draw within the tile.
 * @param {string} [_col] - The colour for the tile outline.
 */


function drawTile(_x, _y, _text = null, _col = "#00FF00") {
  _context.beginPath();

  _context.moveTo(_x, _y + 12);

  _context.lineTo(_x + 48, _y);

  _context.lineTo(_x + 80, _y + 24);

  _context.lineTo(_x + 32, _y + 36);

  _context.lineTo(_x, _y + 12);

  _context.closePath();

  _context.lineWidth = 1;
  _context.strokeStyle = _col;

  _context.stroke();

  if (_text) {
    _context.font = "8px Georgia";
    _context.fillStyle = _col;

    _context.fillText(_text, _x + 4, _y + 10);
  }
}
/**
 * Converts a hex index to the onscreen coordinates representing its position
 * in the world map.
 * @param {number} i - The index to convert.
 * @returns An object containing the x,y coordinates representing this hex index.
 */


function convertHexIndexToScreenCoords(i) {
  const q = i % map_hex_width | 0;
  const r = i / map_hex_width | 0;
  const px = 0 - q * 32 + r * 16;
  const py = r * 12;
  const qx = (q / 2 | 0) * 16;
  const qy = (q / 2 | 0) * 12;
  return {
    x: px + qx,
    y: py + qy
  };
}
/**
 * Converts a map tile index to the onscreen coordinates representing its position
 * in the world map.
 * @param {number} i - The index to convert.
 * @returns An object containing the x,y coordinates representing this tile index.
 */


function convertTileIndexToScreenCoords(i) {
  const tCol = i % map_tile_width;
  const tRow = i / map_tile_width | 0;
  return {
    x: 0 - map_alignment_offset.x - tCol * 48 + tRow * 32,
    // map origin { x: 0, y: 0} is at upper right.
    y: map_alignment_offset.y + tCol * 12 + tRow * 24
  };
}
/**
 * Finds the hex index that a particular x,y coordinate point will fall within.
 * @param {number} mx - The x coordinate to check.
 * @param {number} my - The y coordinate to check.
 * @returns The hex index representing what hex these coordinates fall within.
 */


function convertScreenCoordsToHexIndex(mx, my) {
  // compensate for -0 effect
  if (mx < 0) {
    mx -= 32;
  }

  mx *= -1;
  let hCol = mx / 32 | 0;
  let hRow = my / 12 | 0;

  if (hRow > 0) {
    hCol += Math.abs(hRow / 2) | 0;
  }

  hRow -= hCol / 2 | 0;
  return hRow * map_hex_width + hCol;
}
/**
 * Finds all the adjacent hexes to a provided hex index.
 * @param {number} i - The hex index to check.
 * @returns An array of indexes of hexes adjacent to the provided hex index.
 */


function findAdjacentHexes(i) {
  return new Array(i % 2 ? i - (map_hex_width + 1) : i - 1, i % 2 ? i - 1 : i + (map_hex_width - 1), i + map_hex_width, i % 2 ? i + 1 : i + (map_hex_width + 1), i % 2 ? i - (map_hex_width - 1) : i + 1, i - map_hex_width);
}
/**
 * Finds the orientation between two adjacent hexes.
 * @param {number} _origin - The origin hex.
 * @param {number} _dest - The destination hex.
 * @returns The orientation.
 */


function findOrientation(_origin, _dest) {
  if (_origin == _dest) {
    console.log("MainState: findOrientation error: origin and dest identical");
    return 0;
  }

  const orientation = findAdjacentHexes(_origin).indexOf(_dest);

  if (orientation == -1) {
    console.log("MainState: findOrientation error: -1");
    return 0;
  }

  return orientation;
}
/**
 * default function used for heuristic score in pathfinding algorith,
 * can be replaced with better one as needed.
 * @param {*} _a - The starting point.
 * @param {*} _b - The ending point.
 * @returns The distance.
 */


function hDistance(_a, _b) {
  // pythagorean distance.
  const ha = convertHexIndexToScreenCoords(_a);
  const hb = convertHexIndexToScreenCoords(_b);
  const dx = Math.abs(hb.x - ha.x);
  const dy = Math.abs(hb.y - ha.y);
  return Math.sqrt(dx * dx + dy * dy);
}
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
let _mouse = {
  // struct for mouse info
  x: 0,
  y: 0
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

function getTicks() {
  return fps_currentTime;
}

const isObject = o => o !== null && typeof o === 'object';

const isFunction = f => f && {}.toString.call(f) === '[object Function]';
/**
 * Returns object type from typeID
 * @param {*} _id The typeID to check.
 * @returns A string indicating the object type, or false if none matched.
 */


function getObjectType(_id) {
  return ["items", "critters", "scenery", "walls", "tiles", "misc"][_id] || false;
}
class Interface {
  constructor(file = null) {
    this.x = 0;
    this.y = 0;
    this.elements = [];
    console.log("Interface: loading file:" + file);
    if (!file) return false;
    main_loadJsonPayload(file).then(res => {
      this.elements = res.elements;
      this.x = res.x;
      this.y = res.y;
      this.width = res.width;
      this.height = res.height;
    }).catch(main_payloadError);
    this.activeItem = -1;
    this.mouseState = 0;
  }

  update() {
    if (intersectTest(_mouse.x, _mouse.y, 0, 0, this.x, this.y, this.width, this.height)) {
      if (_mouse[0]) this.mouseState = 1;else this.mouseState = 0;
      this.elements.forEach((element, index) => {
        if (intersectTest(_mouse.x, _mouse.y, 0, 0, this.x + element.x, this.y + element.y, element.width, element.height)) {
          this.activeItem = index;
          return index;
        }
      });
      return -1;
    } else {
      this.activeItem = -1;
      return -1;
    }
  }

  clickHandler() {
    if (this.activeItem != -1) return this.elements[this.activeItem].handle;else return false;
  }

}

;
"use strict";

class SpriteObject {
  constructor() {
    this.orientation = 0;
    this.hexPosition = 0;
    this.actionQ = [];
    this.PID = 0, this.objectTypeID = 0, this.objectID = 0, this.objectID1 = 0, this.objectID2 = 0, this.objectID3 = 0, this.FID = 0, this.frmID = 0, this.frmTypeID = 0, this.anim = {
      img: 0,
      currentAnim: 0,
      animActive: false,
      frameNumber: 0,
      animDelta: 0,
      lastFrameTime: 0,
      actionFrame: 0,
      actionFrameCallback: 0,
      animEndCallback: 0,
      moveEndCallback: 0,
      shiftX: 0,
      shiftY: 0,
      animLoop: false,
      animDirection: 0 // forward

    };
  }

}

;

class SpriteObject_Door extends SpriteObject {
  //@TODO: FIX
  constructor() {
    super();
    this.locked = false;
    this.key = 0;
    this.openState = 0;
  }

}

;

class Actor extends SpriteObject {
  constructor() {
    super();
    this.runState = false;
    this.moveState = false;
    this.moveDest = 0;
    this.nextMove = 0;
    this.ai = {
      moveState: false,
      runState: false,
      moveDest: 0,
      moveNext: 0,
      pathQ: 0,
      idleStartTime: 0
    };
    this.skills = {
      "Small Guns": {
        level: 0,
        tagged: 0
      },
      "Big Guns": {
        level: 0,
        tagged: 0
      },
      "Energy Weapons": {
        level: 0,
        tagged: 0
      },
      "Unarmed": {
        level: 0,
        tagged: 0
      },
      "Melee Weapons": {
        level: 0,
        tagged: 0
      },
      "Throwing": {
        level: 0,
        tagged: 0
      },
      "First Aid": {
        level: 0,
        tagged: 0
      },
      "Doctor": {
        level: 0,
        tagged: 0
      },
      "Sneak": {
        level: 0,
        tagged: 0
      },
      "Lockpick": {
        level: 0,
        tagged: 0
      },
      "Steal": {
        level: 0,
        tagged: 0
      },
      "Traps": {
        level: 0,
        tagged: 0
      },
      "Science": {
        level: 0,
        tagged: 0
      },
      "Repair": {
        level: 0,
        tagged: 0
      },
      "Speech": {
        level: 0,
        tagged: 0
      },
      "Barter": {
        level: 0,
        tagged: 0
      },
      "Gambling": {
        level: 0,
        tagged: 0
      },
      "Outdoorsman": {
        level: 0,
        tagged: 0
      }
    };
    this.stats = {
      "armorClass": {
        level: 1
      },
      "actionPoints": {
        level: 1
      },
      "carryWeight": {
        level: 1
      },
      "meleeDamage": {
        level: 1
      },
      "damageRes": {
        level: 1
      },
      "poisonRes": {
        level: 1
      },
      "radiationRes": {
        level: 1
      },
      "sequence": {
        level: 1
      },
      "healingRate": {
        level: 1
      },
      "criticalChance": {
        level: 1
      }
    };
  }

}

;
const newGame_createPlayer = () => {
  const newGame_player = new Actor();
  newGame_player.PID = 0;
  newGame_player.objectTypeID = 1;
  newGame_player.objectID = 0;
  newGame_player.name = "Anthony";
  newGame_player.age = 28;
  newGame_player.sex = "male";
  newGame_player.FID = 16777227; // hmjmpsaa

  newGame_player.frmTypeID = 0;
  newGame_player.frmID = 0;
  return newGame_player;
};

const newGame = {
  map: "geckpwpl.map",
  //map: "mbclose.map",
  playerStartPos: "default",
  playerStartOrientation: "default",
  playerStartElevation: "default",
  player: newGame_createPlayer() // populate this on game init

};
"use strict";

class MainState extends GameState {
  constructor() {
    super();
    this.map = {
      hexMap: 0,

      hexStatus(i, e) {
        return !this.hexMap[e][i].blocked;
      }

    };
    this.interfaceRect = new Interface("jsfdata/interface/mainStateInterface.json");
    this.console = {
      consoleData: [],
      x: 30,
      y: 454,
      fontHeight: 10,
      fontColor: "#00FF00",
      print: function () {
        // accepts n arguments, pushes all to console
        for (let i = 0; i < arguments.length; i++) {
          let string = "\x95" + arguments[i];
          let split = string.match(/.{1,22}/g); // split string to line width

          for (let k = 0; k < split.length; k++) this.consoleData.unshift(split[k]);
        }
      },
      clear: function () {
        this.consoleData = [];
      }
    };
    /*
     * objectBuffer and objectBuffer2 are utilized for picking the pixel precise screen object
     * the cursor is over during an action. It works by 'stenciling' sprites to the buffer
     * in a 'paint by numbers' manner, painting a unique colour for each object.
     * This can then be reversed to find the object under the cursor.
     * Object buffer canvas size CAN be modified with few ill effects.
     */

    this.outlineTargets = false;
    this.objectBufferRect = {
      x: 0,
      y: 0,
      width: 100,
      height: 100
    };
    this.eggBufferRect = {
      x: 0,
      y: 0,
      width: 129,
      height: 98
    };
    this.objectBuffer = document.createElement("canvas");
    this.objectBufferContext = this.objectBuffer.getContext("2d");
    this.objectBuffer2 = document.createElement("canvas");
    this.objectBufferContext2 = this.objectBuffer2.getContext("2d");
    this.objectBuffer2.width = this.objectBufferRect.width;
    this.objectBuffer2.height = this.objectBufferRect.height;
    this.eggBuffer = document.createElement("canvas"); //this.eggBuffer.width = this.eggBufferRect.width;
    //this.eggBuffer.height = this.eggBufferRect.height;
    // @TODO: FIX - this is a crude fix placed in to fix an issue with Chrome v46+
    // Refer to: https://code.google.com/p/chromium/issues/detail?id=543342

    this.eggBuffer.width = 300;
    this.eggBuffer.height = 300;
    this.eggContext = this.eggBuffer.getContext("2d");
    this.transEgg = document.getElementById("trans_egg");
    /*
     * Do not modify transEgg canvas size, it's position is centered around the player by it's width.
     * This may be fixed at a later date by hardcoding the width.
     */

    this.brightmap = document.createElement("canvas");
    this.brightmap.width = SCREEN_WIDTH;
    this.brightmap.height = SCREEN_HEIGHT;
    this.brightmapContext = this.brightmap.getContext("2d");
    this.currentRenderObject = 0;
    this.currentRenderImg = 0; // Scroll handler.

    this.scrollDelta = 5;
    this.scrollCheckIndex = 0;
    this.scrollCheckAdj = 0;
    this.hIndex = 0;
    this.hsIndex = 0;
    this.mapObjects = 0;
    this.player = 0;
    this.inputRunState = false;
    this.scrollStates = {
      xPos: false,
      xNeg: false,
      yPos: false,
      yNeg: false,
      xPosBlocked: false,
      xNegBlocked: false,
      yPosBlocked: false,
      yNegBlocked: false
    };
    this.objectIndex = 0;
    this.inputState = "game";
    this.inputState_sub = "move";
    this.roofRenderState = 0;
    this.camera = {
      x: 0,
      y: 0,

      // track camera to coordinates.
      trackToCoords(_c) {
        this.x = _c.x - SCREEN_WIDTH * 0.5 | 0;
        this.y = _c.y - SCREEN_HEIGHT * 0.5 | 0;
      }

    };
    this.mapLightLevel = 1;
    this.scrollimg = 0;
    this.cIndex_time;
    this.cIndex_test;
    this.cIndex_state = false;
    this.cIndex_path = -1;
    this.cIndex_x;
    this.cIndex_y;
    this.path_closedSet = 0; // findPath vars

    this.path_frontier = 0;
    this.path_cameFrom = 0;
    this.path_g_score = 0;
    this.path_f_score = 0;
    this.path_tg_score = 0;
    this.path_path = 0;
    this.path_current = 0;
    this.path_next = 0;
    this.path_adjList = 0;
  }
  /**
   * Pathfinding function.
   * @param {*} start
   * @param {*} dest
   */


  findPath(start, dest) {
    if (start === dest) {
      return 0;
    }

    this.path_closedSet = [];
    this.path_frontier = [start];
    this.path_cameFrom = [];
    this.path_g_score = [];
    this.path_f_score = [];
    this.path_g_score[start] = 0;
    this.path_f_score[start] = hDistance(start, dest);

    while (this.path_frontier.length) {
      this.path_current = this.path_frontier[0]; // Get lowest f_score - O(1).

      for (let k = 0; k < this.path_frontier.length; k++) {
        if (this.path_f_score[this.path_frontier[k]] < this.path_f_score[this.path_current]) {
          this.path_current = this.path_frontier[k];
        }
      } // If dest reached.


      if (this.path_current === dest) {
        this.path_path = []; // Iterate backwards through solution, add to path array.

        this.path_path.unshift(dest);
        this.path_current = this.path_cameFrom[dest];

        while (this.path_current != start) {
          this.path_path.unshift(this.path_current);
          this.path_current = this.path_cameFrom[this.path_current];
        }

        return this.path_path;
      }

      this.path_adjList = findAdjacentHexes(this.path_current);
      this.path_closedSet.push(this.path_frontier.shift());

      for (let i = 0; i < 6; i++) {
        this.path_next = this.path_adjList[i]; // If out of bounds.

        if (this.path_next < 0 || this.path_next > 40000) {
          continue;
        } // If in closedList.


        if (this.path_closedSet.indexOf(this.path_next) != -1) {
          continue;
        } // If blocked.


        if (this.map.hexMap[this.player.currentElevation][this.path_next].blocked) {
          this.path_closedSet.push(this.path_next);
          continue;
        }

        this.path_tg_score = this.path_g_score[this.path_current] + hDistance(this.path_current, this.path_next);

        if (this.path_frontier.indexOf(this.path_next) == -1 || this.path_tg_score < this.path_g_score[this.path_next]) {
          this.path_cameFrom[this.path_next] = this.path_current;
          this.path_g_score[this.path_next] = this.path_tg_score;
          this.path_f_score[this.path_next] = this.path_g_score[this.path_next] + hDistance(this.path_next, dest);

          if (this.path_frontier.indexOf(this.path_next) == -1) {
            this.path_frontier.push(this.path_next);
          }
        }
      }
    }

    return 0;
  }
  /**
   * use arguments here to pass saved state data.
   * @param {*} _saveState
   */


  loadSaveState(_saveState) {
    console.log("MainState: init: " + _saveState.map);
    let loadMap = "maps/" + _saveState.map;
    this.map.defaultElevation = _assets[loadMap].defaultElevation; // copy map lets

    this.map.elevationAt0 = _assets[loadMap].elevationAt0;
    this.map.elevationAt1 = _assets[loadMap].elevationAt1;
    this.map.elevationAt2 = _assets[loadMap].elevationAt2;
    this.map.nElevations = _assets[loadMap].nElevations;
    this.map.globalvars = _assets[loadMap].globalvars;
    this.map.localvars = _assets[loadMap].localvars;
    this.map.playerStartDir = _assets[loadMap].playerStartDir;
    this.map.playerStartPos = _assets[loadMap].playerStartPos;
    this.map.tileInfo = _assets[loadMap].tileInfo;
    console.log("MainState: init: initializing hexGrid");
    this.map.hexMap = new Array(this.map.nElevations); // init/reset hexmap

    this.mapObjects = new Array(this.map.nElevations); // create / instantiate mapObjects

    console.log("MainState: init: loading mapObjects");

    for (let n = 0; n < this.map.nElevations; n++) {
      this.map.hexMap[n] = new Array(40000).fill(0).map(hex => ({
        blocked: false,
        disabled: false,
        scrollBlock: false
      }));
      let objectInfoLength = _assets[loadMap].objectInfo[n].length;
      this.mapObjects[n] = new Array(objectInfoLength);

      for (let i = 0; i < objectInfoLength; i++) {
        this.mapObjects[n][i] = this.createMapObject(_assets[loadMap].objectInfo[n][i]); // check if flags for 'can be walked through' are false.

        if (!(this.mapObjects[n][i].itemFlags & 0x00000010)) {
          this.map.hexMap[n][this.mapObjects[n][i].hexPosition].blocked = true;
        }

        switch (getObjectType(this.mapObjects[n][i].frmTypeID)) {
          case "walls":
            break;

          case "misc":
            // this needs massive fixing, need to figure out what value this is meant to be
            switch (this.mapObjects[n][i].objectID) {
              case 12:
                // scrollblockers
                this.map.hexMap[n][this.mapObjects[n][i].hexPosition].scrollBlock = true;
                break;

              case 16: // exit grids

              case 17:
              case 18:
              case 19:
              case 20:
              case 21:
              case 22:
              case 23:
                this.map.hexMap[n][this.mapObjects[n][i].hexPosition].exitGrid = true;
                this.map.hexMap[n][this.mapObjects[n][i].hexPosition].exitGrid_map = this.mapObjects[n][i].exitGrid_map;
                this.map.hexMap[n][this.mapObjects[n][i].hexPosition].exitGrid_pos = this.mapObjects[n][i].exitGrid_pos;
                this.map.hexMap[n][this.mapObjects[n][i].hexPosition].exitGrid_elev = this.mapObjects[n][i].exitGrid_elev;
                this.map.hexMap[n][this.mapObjects[n][i].hexPosition].exitGrid_orientation = this.mapObjects[n][i].exitGrid_orientation;
                break;
            }

            break;
        }

        ;
      }
    }

    console.log("MainState: init: creating player");
    this.player = _saveState.player;

    if (_saveState.playerStartPos == "default") {
      this.player.hexPosition = this.map.playerStartPos;
    } else {
      this.player.hexPosition = _saveState.playerStartPos;
    }

    if (_saveState.playerStartOrientation == "default") {
      this.player.orientation = this.map.playerStartDir;
    } else {
      this.player.orientation = _saveState.playerStartOrientation;
    }

    if (_saveState.playerStartElevation == "default") {
      this.player.currentElevation = this.map.defaultElevation;
    } else {
      this.player.currentElevation = _saveState.playerStartElevation;
    }

    this.object_setAnim(this.player, "idle");
    this.mapObjects[this.player.currentElevation].push(this.player);
    console.log("MainState: init: loading finished");
    this.camera.trackToCoords(convertHexIndexToScreenCoords(this.player.hexPosition));
    return true;
  }
  /**
   * Creates a gamestate for MainState to load to facilitate switching maps.
   * @param {*} _map
   * @param {*} _pos
   * @param {*} _elev
   * @param {*} _orientation
   */


  createSaveState(_map, _pos = "default", _elev = "default", _orientation = "default") {
    const saveState = {
      map: _assets["data/maps.txt"][_map].mapName + ".map",
      player: this.player,
      playerStartPos: _pos,
      playerStartOrientation: _orientation,
      playerStartElevation: _elev
    };
    return saveState;
  }
  /**
   *
   * @param {*} _map
   * @param {*} _pos
   * @param {*} _elev
   * @param {*} _orientation
   */


  exitMap(_map, _pos, _elev, _orientation) {
    // reset movement lets so player doesn't get stuck in an unfinishable
    // moveState when switching maps.
    this.actor_endMoveState(this.player);
    main_loadGame(this.createSaveState(_map, _pos, _elev, _orientation));
  }

  /**
   *
   * @param {*} e
   */
  input(e) {
    if (e.type == "keydown" && _keyboard['Escape']) {
      main_gameStateFunction('openIngameMenu');
      return;
    }

    if (this.inputState == "game") {
      switch (e.type) {
        case "click":
          if (this.inputState_sub == "move") {
            this.actor_beginMoveState(this.player, this.hIndex, this.inputRunState); // this.actor_cancelAction(this.player);
          }

          break;

        case 'contextmenu':
          // switch input modes on mouse2
          this.inputState_sub == "move" ? this.inputState_sub = "command" : this.inputState_sub = "move";
          break;

        case "mousedown":
          if (this.inputState_sub == "command") {
            // stop mouse2 from triggering commands when in command mode.
            if (_mouse[2]) {
              return;
            }

            this.objectIndex = this.getObjectIndex(); // if object under cursor.

            if (this.objectIndex != -1) {
              let objC = convertHexIndexToScreenCoords(this.mapObjects[this.player.currentElevation][this.objectIndex].hexPosition);
              main_gameStateFunction('openContextMenu', {
                // Context Menu
                obj: this.objectIndex,
                x: objC.x - this.camera.x + 30,
                y: objC.y - this.camera.y - 20
              });
            }
          }

          break;
      }
    } else if (this.inputState == "interface") {
      switch (e.type) {
        case "click":
          main_gameStateFunction(this.interfaceRect.clickHandler());
          this.interfaceRect.activeItem = -1;
          break;

        case "mousedown":
          this.interfaceRect.mouseState = 1;
          break;

        case "mouseup":
          this.interfaceRect.mouseState = 0;
          break;
      }
    }
  }
  /**
   *
   * @param {*} action
   * @param {*} target
   */


  contextMenuAction(action, target) {
    if (target == -1) return;

    switch (action) {
      case "hoverlook":
      case "look":
        let textIndex, msgFile;

        if (action == "hoverlook") {
          textIndex = this.mapObjects[this.player.currentElevation][target].textID;
        } else if (action == "look") {
          textIndex = this.mapObjects[this.player.currentElevation][target].textID + 1;
        }

        switch (getObjectType(this.mapObjects[this.player.currentElevation][target].objectTypeID)) {
          case "items":
            msgFile = _assets["text/english/game/pro_item.msg"];
            break;

          case "critters":
            msgFile = _assets["text/english/game/pro_crit.msg"];
            break;

          case "scenery":
            msgFile = _assets["text/english/game/pro_scen.msg"];
            break;

          case "walls":
            msgFile = _assets["text/english/game/pro_wall.msg"];
            break;

          case "tiles":
            msgFile = _assets["text/english/game/pro_tile.msg"];
            break;

          case "misc":
            msgFile = _assets["text/english/game/pro_misc.msg"];
            break;

          default:
            return false;
        }

        if (msgFile.data[textIndex]) {
          // "You see: %s."
          this.console.print(_assets["text/english/game/proto.msg"].data[490].text.replace("%s", msgFile.data[textIndex].text));
        } else {
          // "You see nothing out of the ordinary."
          this.console.print(_assets["text/english/game/proto.msg"].data[493].text);
        }

        break;

      case "use":
        let useDest = -1; // find adj hexes

        let useFunction = 0;
        let targetItem = this.mapObjects[this.player.currentElevation][target];
        console.log(targetItem);
        let useAdj = findAdjacentHexes(targetItem.hexPosition);
        useDest = useAdj.indexOf(this.player.hexPosition); // check if player next to item

        for (let a = 0; a < 6; a++) {
          if (this.findPath(this.player.hexPosition, useAdj[a])) {
            useDest = useAdj[a];
            break;
          }
        }

        switch (targetItem.objectType) {
          case "door":
            useFunction = function () {
              //console.log("useFunction: " + targetItem.hexPosition + " / " + mainState.player.hexPosition);
              this.player.orientation = findOrientation(this.player.hexPosition, targetItem.hexPosition);
              this.object_playAnim(this.player, "use", 0, 0, 0, false, 0, () => {
                if (targetItem.openState == 0) this.object_openDoor(targetItem);else this.object_closeDoor(targetItem);
              });
            };

            break;
        }

        if (useFunction) {
          if (useDest == this.player.hexPosition) useFunction();else if (useDest != -1) {
            // fix this to be correctly aligned
            this.actor_addAction(this.player, useFunction, "endMoveState");
            this.actor_beginMoveState(this.player, useDest, this.inputRunState);
          }
        } else {
          console.log("no useFunction definiton");
        }

        break;

      case "cancel":
        break;
    }
  }
  /**
   * Checks whether the mouse cursor is over the interface.
   * @returns A boolean indicating whether the mouse is over the interface rectangle.
   */


  isCursorOverInterface() {
    return intersectTest(_mouse.x, _mouse.y, 0, 0, this.interfaceRect.x, this.interfaceRect.y, this.interfaceRect.width, this.interfaceRect.height);
  }
  /**
   * Gets the index of the object under the cursor.
   * @NOTE This function stencils screen objects onto an offscreen buffer, with a solid
   * color based upon that object's position in the mapObjects array.
   * From this function you can accurately find the object under the cursor by blitting
   * the objects 50px around the cursor onto the buffer, then reading the color underneath
   * the centre of the image.
   * From the formula r*1000 + b*100 + g we can find the index of the object.
   * @TODO Refactor
   * @returns The index of the object under the cursor.
   */


  getObjectIndex() {
    this.objectBufferRect.x = _mouse.x - this.objectBufferRect.width / 2;
    this.objectBufferRect.y = _mouse.y - this.objectBufferRect.height / 2;

    for (let i = 0; i < this.mapObjects[this.player.currentElevation].length; i++) {
      this.currentRenderObject = this.mapObjects[this.player.currentElevation][i];
      const c = convertHexIndexToScreenCoords(this.currentRenderObject.hexPosition);
      this.currentRenderImg = this.currentRenderObject.anim.img.frameInfo[this.currentRenderObject.orientation][this.currentRenderObject.anim.frameNumber]; // Object coords.

      const destX = c.x + 16 - (this.currentRenderImg.width / 2 | 0) + this.currentRenderObject.anim.shiftX - this.camera.x;
      const destY = c.y + 8 - this.currentRenderImg.height + this.currentRenderObject.anim.shiftY - this.camera.y;

      if (!intersectTest(destX, destY, this.currentRenderImg.width, this.currentRenderImg.height, this.objectBufferRect.x, this.objectBufferRect.y, this.objectBufferRect.width, this.objectBufferRect.height)) {
        continue;
      }

      const cCol = this.currentRenderObject.hexPosition % 100;
      const pCol = this.player.hexPosition % 100;
      const cRow = this.currentRenderObject.hexPosition / 100 | 0;
      const pRow = this.player.hexPosition / 100 | 0; // Don't blit walls 'infront' of player.

      if (getObjectType(this.currentRenderObject.frmTypeID) == "walls") {
        if (!(cRow < pRow || cCol < pCol)) {
          continue;
        }
      }

      this.objectBufferContext2.globalCompositeOperation = "source-over"; // Hack screen clear.

      this.objectBuffer2.width = this.objectBufferRect.width;
      blitFRM(this.currentRenderObject.anim.img, this.objectBufferContext2, 0, 0, this.currentRenderObject.orientation, this.currentRenderObject.anim.frameNumber);
      this.objectBufferContext2.globalCompositeOperation = "source-in";
      this.objectBufferContext2.fillStyle = `rgb(${Math.floor(i / 1000)},${Math.floor(i % 1000 / 100)},${i % 100})`;
      this.objectBufferContext2.fillRect(0, 0, this.currentRenderImg.width, this.currentRenderImg.height);
      this.objectBufferContext.drawImage(this.objectBuffer2, destX - this.objectBufferRect.x, destY - this.objectBufferRect.y);
    }

    this.objectBufferData = this.objectBufferContext.getImageData(50, 50, 1, 1).data; // if alpha for pixel == 0, no object under cursor.

    if (this.objectBufferData[3] == 0) {
      return -1;
    }

    return this.objectBufferData[0] * 1000 + this.objectBufferData[1] * 100 + this.objectBufferData[2];
  }

  update() {
    // STATE HANDLING
    this.scrollStates.yNeg = _mouse.y < SCREEN_HEIGHT * 0.025;
    this.scrollStates.yPos = _mouse.y > SCREEN_HEIGHT * 0.975;
    this.scrollStates.xNeg = _mouse.x < SCREEN_WIDTH * 0.025;
    this.scrollStates.xPos = _mouse.x > SCREEN_WIDTH * 0.975;
    this.scrollState = this.scrollStates.yNeg || this.scrollStates.yPos || this.scrollStates.xNeg || this.scrollStates.xPos;

    if (intersectTest(_mouse.x, _mouse.y, 0, 0, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT) && this.scrollState) {
      this.inputState = "scroll";
      this.scrollCheckAdj = findAdjacentHexes(convertScreenCoordsToHexIndex(320 + this.camera.x, 190 + this.camera.y));
      this.scrollStates.xPosBlocked = this.map.hexMap[this.player.currentElevation][this.scrollCheckAdj[1]].scrollBlock; // check if these hexes have the scrollBlock attribute.

      this.scrollStates.yNegBlocked = this.map.hexMap[this.player.currentElevation][this.scrollCheckAdj[0]].scrollBlock && this.map.hexMap[this.player.currentElevation][this.scrollCheckAdj[5]].scrollBlock;
      this.scrollStates.yNegBlocked = this.map.hexMap[this.player.currentElevation][this.scrollCheckAdj[0]].scrollBlock && this.map.hexMap[this.player.currentElevation][this.scrollCheckAdj[5]].scrollBlock;
      this.scrollStates.yPosBlocked = this.map.hexMap[this.player.currentElevation][this.scrollCheckAdj[2]].scrollBlock && this.map.hexMap[this.player.currentElevation][this.scrollCheckAdj[3]].scrollBlock;
      this.scrollStates.xNegBlocked = this.map.hexMap[this.player.currentElevation][this.scrollCheckAdj[4]].scrollBlock; // scrolling handling

      if (this.scrollStates.yNeg && !this.scrollStates.yNegBlocked) {
        this.camera.y -= this.scrollDelta;
      }

      if (this.scrollStates.yPos && !this.scrollStates.yPosBlocked) {
        this.camera.y += this.scrollDelta;
      }

      if (this.scrollStates.xNeg && !this.scrollStates.xNegBlocked) {
        this.camera.x -= this.scrollDelta;
      }

      if (this.scrollStates.xPos && !this.scrollStates.xPosBlocked) {
        this.camera.x += this.scrollDelta;
      }
    } else if (this.isCursorOverInterface()) {
      this.inputState = "interface"; // @TODO bug here.

      this.interfaceRect.update();
    } else {
      this.inputState = "game";

      if (this.inputState_sub == "move") {
        // Hex index calculated here.
        this.hIndex = convertScreenCoordsToHexIndex(_mouse.x + this.camera.x, _mouse.y + this.camera.y);
        this.hsIndex = convertHexIndexToScreenCoords(this.hIndex); // Check if mouse has moved for hover functionality.

        if (this.cIndex_test != this.hIndex) {
          this.cIndex_test = this.hIndex;
          this.cIndex_time = getTicks();
          this.cIndex_state = false;
          this.cIndex_path = -1;
        }
      } else if (this.inputState_sub == "command") {
        // Check if mouse has moved for hover functionality.
        if (this.cIndex_x != _mouse.x || this.cIndex_y != _mouse.y) {
          this.cIndex_x = _mouse.x;
          this.cIndex_y = _mouse.y;
          this.cIndex_time = getTicks();
          this.cIndex_state = false;
        }
      } // 'hover' functionality timer.


      if (!this.cIndex_state && Math.abs(getTicks() - this.cIndex_time) >= 1000) {
        if (this.inputState_sub == "move") {
          this.cIndex_path = this.findPath(this.player.hexPosition, this.hIndex);
          this.cIndex_state = true;
        } else if (this.inputState_sub == "command") {
          this.objectIndex = this.getObjectIndex();
          this.contextMenuAction("hoverlook", this.objectIndex);
          this.cIndex_state = true;
        }
      }
    } // SHIFT control input for running.


    if (_keyboard['ShiftRight'] || _keyboard['ShiftLeft']) {
      this.inputRunState = true;
    } else this.inputRunState = false;
    /** The player's current elevation. */


    const e = this.player.currentElevation; // z-sort.

    this.mapObjects[e].sort((a, b) => {
      return a.hexPosition - b.hexPosition || a.anim.shiftY - b.anim.shiftY;
    }); // Animation
    // Tasks, framestep.

    const mapObjectsLength = this.mapObjects[e].length;

    for (let i = 0; i < mapObjectsLength; i++) {
      this.currentRenderObject = this.mapObjects[e][i];
      this.currentRenderImg = this.currentRenderObject.anim.img;

      if (this.currentRenderObject.anim.animActive) {
        // framestep and animation functions
        this.currentRenderObject.anim.animDelta = getTicks() - this.currentRenderObject.anim.lastFrameTime; // if time to update frame.

        if (this.currentRenderObject.anim.animDelta >= 1000 / this.currentRenderImg.fps) {
          /**
           * Checks whether an animated object is currently mid-animation.
           * @param {*} renderObject - The object being checked.
           * @returns A boolean indicating whether this is currently mid-animation..
           */
          function isMidAnimation(renderObject) {
            if (renderObject.anim.animDirection == 0) {
              return renderObject.anim.frameNumber < renderObject.anim.img.nFrames - 1;
            }

            return renderObject.anim.frameNumber > 0;
          } // Frame increment.


          if (isMidAnimation(this.currentRenderObject)) {
            if (this.currentRenderObject.anim.animDirection == 0) {
              this.currentRenderObject.anim.frameNumber++;
              this.currentRenderObject.anim.shiftX += this.currentRenderImg.frameInfo[this.currentRenderObject.orientation][this.currentRenderObject.anim.frameNumber].offsetX;
              this.currentRenderObject.anim.shiftY += this.currentRenderImg.frameInfo[this.currentRenderObject.orientation][this.currentRenderObject.anim.frameNumber].offsetY;
            } else {
              // Reverse.
              this.currentRenderObject.anim.shiftX -= this.currentRenderImg.frameInfo[this.currentRenderObject.orientation][this.currentRenderObject.anim.frameNumber].offsetX;
              this.currentRenderObject.anim.shiftY -= this.currentRenderImg.frameInfo[this.currentRenderObject.orientation][this.currentRenderObject.anim.frameNumber].offsetY;
              this.currentRenderObject.anim.frameNumber--;
            } // If action frame.


            if (this.currentRenderObject.anim.frameNumber == this.currentRenderObject.anim.actionFrame) {
              this.actor_nextAction(this.currentRenderObject, "onActionFrame");
            }
          } else {
            // If anim ended.
            if (this.currentRenderObject.anim.animLoop) {
              if (this.currentRenderObject.anim.animDirection == 0) {
                this.object_setFrame(this.currentRenderObject, 0);
              } else {
                // Reverse.
                this.object_setFrame(this.currentRenderObject, -1);
              }
            } else {
              this.currentRenderObject.anim.animActive = false;
            }

            this.actor_nextAction(this.currentRenderObject, "onAnimEnd");
          }

          this.currentRenderObject.anim.lastFrameTime = getTicks();
        }
      } else {
        // idle twitch
        if (this.currentRenderObject.hasOwnProperty("ai")) {
          if (getTicks() - this.currentRenderObject.ai.idleStartTime > 2000) {
            if (Math.random() > 0.95) {
              this.object_playAnim(this.currentRenderObject, "idle", 0, 0, 0, false, 0, function () {
                // reset to frame zero.
                this.object_setAnim(this.currentRenderObject, "idle");
              });
            }

            this.currentRenderObject.ai.idleStartTime = getTicks();
          }
        }
      }
    } // end mapobjects loop.


    const playerCoords = convertHexIndexToScreenCoords(this.player.hexPosition);
    this.currentRenderImg = this.player.anim.img.frameInfo[this.player.orientation][this.player.anim.frameNumber]; // Actual coords of objects.

    const playerX = playerCoords.x + 16 - (this.currentRenderImg.width / 2 | 0) + this.player.anim.shiftX - this.camera.x;
    const playerY = playerCoords.y + 8 - this.currentRenderImg.height + this.player.anim.shiftY - this.camera.y; // Check if player is under a roof.

    this.roofRenderState = true;

    for (let i = 0; i < 10000; i++) {
      if (this.map.tileInfo[this.player.currentElevation].roofTiles[i] < 2) continue;
      let c = convertTileIndexToScreenCoords(i); // @TODO : potentially use object buffer here.

      if (intersectTest(c.x - this.camera.x, c.y - 96 - this.camera.y, 80, 36, playerX, playerY, this.currentRenderImg.width, this.currentRenderImg.height)) {
        this.roofRenderState = false;
        break;
      }
    }
  }

  render() {
    // clear eggBuffer hack.
    // @TODO: Replace with a version hardcoded to eggBufferRect.width.
    this.eggBuffer.width = 300; // Draw egg mask onto egg context.

    this.eggContext.globalCompositeOperation = "source-over";
    this.eggContext.drawImage(this.transEgg, 0, 0);
    let playerCoords = convertHexIndexToScreenCoords(this.player.hexPosition);
    let playerX = playerCoords.x + 16 + this.player.anim.shiftX - this.camera.x;
    let playerY = playerCoords.y + 8 + this.player.anim.shiftY - this.camera.y; // @TODO: fix this

    this.eggBufferRect.x = playerX - this.eggBufferRect.width / 2 | 0;
    this.eggBufferRect.y = playerY - (this.eggBufferRect.height / 2 | 0) - 35;
    let e = this.player.currentElevation; // render floor tiles.

    for (let i = 0; i < 10000; i++) {
      //if(this.map.tileInfo[e].floorTiles[i] < 2) continue;
      let c = convertTileIndexToScreenCoords(i); // Camera test.

      if (!intersectTest(c.x, c.y, 80, 36, this.camera.x, this.camera.y, SCREEN_WIDTH, SCREEN_HEIGHT)) continue;
      blitFRM(_assets['art/tiles/tiles.lst'][this.map.tileInfo[e].floorTiles[i]].ptr, _context, c.x - this.camera.x, c.y - this.camera.y); // Camera test.

      if (!intersectTest(c.x - this.camera.x, c.y - this.camera.y, 80, 36, this.eggBufferRect.x, this.eggBufferRect.y, this.eggBufferRect.width, this.eggBufferRect.height)) continue; // Transparency egg.

      this.eggContext.globalCompositeOperation = "source-atop";
      blitFRM(_assets['art/tiles/tiles.lst'][this.map.tileInfo[e].floorTiles[i]].ptr, this.eggContext, c.x - this.camera.x - this.eggBufferRect.x, c.y - this.camera.y - this.eggBufferRect.y);
    } // Lower hex cursor.


    if (this.inputState == "game" && this.inputState_sub == "move") {
      blitFRM(_assets["art/intrface/msef000.frm"], _context, this.hsIndex.x - this.camera.x, this.hsIndex.y - this.camera.y);
      blitFRM(_assets["art/intrface/msef000.frm"], this.eggContext, this.hsIndex.x - this.camera.x - this.eggBufferRect.x, this.hsIndex.y - this.camera.y - this.eggBufferRect.y);
    } // render map objects.


    this.eggContext.globalCompositeOperation = 'source-over';

    for (let i = 0, mapObjectsLength = this.mapObjects[e].length; i < mapObjectsLength; i++) {
      this.currentRenderObject = this.mapObjects[e][i];
      let c = convertHexIndexToScreenCoords(this.currentRenderObject.hexPosition);
      this.currentRenderImg = this.currentRenderObject.anim.img.frameInfo[this.currentRenderObject.orientation][this.currentRenderObject.anim.frameNumber]; //@TODO: clean

      let destX = c.x + 16 - (this.currentRenderImg.width / 2 | 0) + this.currentRenderObject.anim.shiftX - this.camera.x; // actual coords of of objects.

      let destY = c.y + 8 - this.currentRenderImg.height + this.currentRenderObject.anim.shiftY - this.camera.y; // Test if object is on screen. If not - skip.
      // testing in screen space with dest lets, slower but more accurate.

      if (!intersectTest(destX, destY, this.currentRenderImg.width, this.currentRenderImg.height, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)) {
        continue;
      } // Get dest coords in screen-space and blit.


      blitFRM(this.currentRenderObject.anim.img, _context, destX, destY, this.currentRenderObject.orientation, this.currentRenderObject.anim.frameNumber); // Render mapObjects on eggBufferRect.
      // Test if under eggBufferRect.

      if (intersectTest(destX, destY, this.currentRenderImg.width, this.currentRenderImg.height, this.eggBufferRect.x, this.eggBufferRect.y, this.eggBufferRect.width, this.eggBufferRect.height)) {
        let cCol = this.mapObjects[e][i].hexPosition % 100;
        let pCol = this.player.hexPosition % 100;
        let cRow = this.mapObjects[e][i].hexPosition / 100 | 0;
        let pRow = this.player.hexPosition / 100 | 0; // Don't blit walls 'infront' of player.

        if (getObjectType(this.mapObjects[e][i].frmTypeID) == "walls") {
          if (!(cRow < pRow || cCol < pCol)) {
            continue;
          }
        }

        this.eggContext.globalCompositeOperation = "source-atop"; // Get dest coords in screen-space and blit.

        blitFRM(this.currentRenderObject.anim.img, this.eggContext, destX - this.eggBufferRect.x, destY - this.eggBufferRect.y, this.currentRenderObject.orientation, this.currentRenderObject.anim.frameNumber);
        _context.globalCompositeOperation = "source-over";
      }
    } // end mapObject loop
    // Render Roofs - check against roofRenderState.


    if (this.roofRenderState) {
      for (let i = 0; i < 10000; i++) {
        //if(this.map.tileInfo[e].roofTiles[i] < 2) continue;
        let c = convertTileIndexToScreenCoords(i);
        if (!intersectTest(c.x, c.y, 80, 36, this.camera.x, this.camera.y, SCREEN_WIDTH, SCREEN_HEIGHT)) continue;
        blitFRM(_assets['art/tiles/tiles.lst'][this.map.tileInfo[e].roofTiles[i]].ptr, _context, c.x - this.camera.x, c.y - map_roof_height - this.camera.y);
      }
    }

    if (DEBUG_FLAGS.drawSpecialHexes) {
      // Hex debug
      let centreHex = convertHexIndexToScreenCoords(convertScreenCoordsToHexIndex(320 + this.camera.x, 190 + this.camera.y)); // hex debug stuff

      drawHex(centreHex.x - this.camera.x, centreHex.y - this.camera.y, "", "#00FFFF");

      for (let h = 0; h < 40000; h++) {
        let cx = convertHexIndexToScreenCoords(h);
        if (this.map.hexMap[e][h].exitGrid) drawHex(cx.x - this.camera.x, cx.y - this.camera.y, "", "#00FF00");
        if (this.map.hexMap[e][h].blocked) drawHex(cx.x - this.camera.x, cx.y - this.camera.y, "", "#FF0000");
        if (this.map.hexMap[e][h].scrollBlock) drawHex(cx.x - this.camera.x, cx.y - this.camera.y, "", "#FFFF00");
      }
    }

    _context.drawImage(this.eggBuffer, this.eggBufferRect.x, this.eggBufferRect.y); // Render brightmap over the top of the main screen buffer.


    if (this.mapLightLevel < 1) {
      // blit main light level to brightmap buffer.
      const fillStyle = `rgb(${255 * this.mapLightLevel | 0},${255 * this.mapLightLevel | 0},${255 * this.mapLightLevel | 0})`;
      this.brightmapContext.fillStyle = fillStyle;
      this.brightmapContext.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT); //this.brightmapContext.fillStyle = "#FFFFFF";
      //this.brightmapContext.fillRect(this.eggBufferRect.x,this.eggBufferRect.y,200,200);

      _context.globalCompositeOperation = "multiply";

      _context.drawImage(this.brightmap, 0, 0);

      _context.globalCompositeOperation = "source-over"; // reset
    }

    if (this.outlineTargets) {
      for (let i = 0, mapObjectsLength = this.mapObjects[e].length; i < mapObjectsLength; i++) {
        if (!(this.mapObjects[e][i] instanceof Actor)) {
          continue;
        }

        this.currentRenderObject = this.mapObjects[e][i];
        let c = convertHexIndexToScreenCoords(this.currentRenderObject.hexPosition);
        this.currentRenderImg = this.currentRenderObject.anim.img.frameInfo[this.currentRenderObject.orientation][this.currentRenderObject.anim.frameNumber]; // Actual coords of of objects.

        let destX = c.x + 16 - (this.currentRenderImg.width / 2 | 0) + this.currentRenderObject.anim.shiftX - this.camera.x;
        let destY = c.y + 8 - this.currentRenderImg.height + this.currentRenderObject.anim.shiftY - this.camera.y; // Test if object is on screen. If not - skip.
        // Testing in screen space with dest vars, slower but more accurate.

        if (!intersectTest(destX, destY, this.currentRenderImg.width, this.currentRenderImg.height, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)) {
          continue;
        } // Get dest coords in screen-space and blit.


        blitFRMOutline(this.currentRenderObject.anim.img, _context, destX, destY, this.currentRenderObject.orientation, this.currentRenderObject.anim.frameNumber, "#00FFFF");
      } // end mapObject loop

    } // Interface.


    blitFRM(_assets["art/intrface/iface.frm"], _context, this.interfaceRect.x, this.interfaceRect.y);

    if (this.inputState == "interface" && this.interfaceRect.mouseState == 1) {
      // interface
      if (this.interfaceRect.activeItem > -1) {
        blitFRM(_assets[this.interfaceRect.elements[this.interfaceRect.activeItem].downSprite], _context, this.interfaceRect.x + this.interfaceRect.elements[this.interfaceRect.activeItem].x, this.interfaceRect.y + this.interfaceRect.elements[this.interfaceRect.activeItem].y);
      }
    } // console


    for (let i = 0, cl = this.console.consoleData.length > 5 ? 5 : this.console.consoleData.length; i < cl; i++) {
      blitFontString(_assets["font1.aaf"], _context, this.console.consoleData[i], this.console.x, this.console.y - i * this.console.fontHeight, this.console.fontColor);
    } // cursors


    if (this.statePause) return; // don't render cursors if state is paused.

    if (this.inputState == "scroll") {
      // if scrolling
      if (this.scrollStates.xPos) this.scrollimg = this.scrollStates.xPosBlocked ? _assets["art/intrface/screx.frm"] : _assets["art/intrface/screast.frm"];
      if (this.scrollStates.xNeg) this.scrollimg = this.scrollStates.xNegBlocked ? _assets["art/intrface/scrwx.frm"] : _assets["art/intrface/scrwest.frm"];
      if (this.scrollStates.yNeg) this.scrollimg = this.scrollStates.yNegBlocked ? _assets["art/intrface/scrnx.frm"] : _assets["art/intrface/scrnorth.frm"];
      if (this.scrollStates.yNeg && this.scrollStates.xNeg) this.scrollimg = this.scrollStates.yNegBlocked || this.scrollStates.xNegBlocked ? _assets["art/intrface/scrnwx.frm"] : _assets["art/intrface/scrnwest.frm"];
      if (this.scrollStates.yNeg && this.scrollStates.xPos) this.scrollimg = this.scrollStates.yNegBlocked || this.scrollStates.xPosBlocked ? _assets["art/intrface/scrnex.frm"] : _assets["art/intrface/scrneast.frm"];
      if (this.scrollStates.yPos) this.scrollimg = this.scrollStates.yPosBlocked ? _assets["art/intrface/scrsx.frm"] : _assets["art/intrface/scrsouth.frm"];
      if (this.scrollStates.yPos && this.scrollStates.xNeg) this.scrollimg = this.scrollStates.yPosBlocked || this.scrollStates.xNegBlocked ? _assets["art/intrface/scrswx.frm"] : _assets["art/intrface/scrswest.frm"];
      if (this.scrollStates.yPos && this.scrollStates.xPos) this.scrollimg = this.scrollStates.yPosBlocked || this.scrollStates.xNegBlocked ? _assets["art/intrface/scrsex.frm"] : _assets["art/intrface/scrseast.frm"];
      blitFRM(this.scrollimg, _context, _mouse.x, _mouse.y);
    } else if (this.inputState == "interface") {
      // if not scrolling
      blitFRM(_assets["art/intrface/stdarrow.frm"], _context, _mouse.x, _mouse.y);
    } else if (this.inputState == "game") {
      // if not in HUD - on map
      switch (this.inputState_sub) {
        case "move":
          blitFRM(_assets["art/intrface/msef000.frm"], // mouse overlay
          _context, this.hsIndex.x - this.camera.x, this.hsIndex.y - this.camera.y, 0, 0, 0, "#900000", 0.5);

          if (this.cIndex_path == 0) {
            // render "X" if no path to location
            blitFontString(_assets["font1.aaf"], _context, "X", this.hsIndex.x - this.camera.x + 11, this.hsIndex.y - this.camera.y + 5, "#FF0000", "#000000");
          }

          break;

        case "command":
          blitFRM(_assets["art/intrface/actarrow.frm"], _context, _mouse.x, _mouse.y);

          if (this.cIndex_state) {
            blitFRM(_assets["art/intrface/lookn.frm"], _context, _mouse.x + 40, _mouse.y);
          }

          break;
      } // end switch

    }
  }

  createMapObject(source) {
    // Create objects.
    let newObject; // actor.

    if (source.objectTypeID == 1) {
      newObject = new Actor();
      newObject.objectID1 = String.fromCharCode(97 + source.objectID1);
      newObject.objectID2 = String.fromCharCode(97 + source.objectID2);
      newObject.objectID3 = source.objectID3;
      newObject.weapon = 0;
      newObject.armor = 0;
    } else {
      // static
      switch (getObjectType(source.objectTypeID)) {
        case "items":
          // items
          newObject = new SpriteObject();

          switch (source.subtypeID) {
            case 0:
              //armor
              newObject.armorMaleFID = source.armorMaleFID;
              newObject.armorFemaleFID = source.armorFemaleFID;
              break;

            case 3:
              //weapons
              newObject.weaponAnimCode = source.animCode;
              break;
          }

          break;

        case "scenery":
          //scenery
          switch (source.subtypeID) {
            case 0:
              // door
              newObject = new SpriteObject_Door();
              newObject.objectType = "door"; // temp

              break;

            case 1:
              // stairs
              newObject = new SpriteObject();
              break;

            case 2:
              // elevator
              newObject = new SpriteObject();
              break;

            default:
              newObject = new SpriteObject();
              break;
          }

          break;

        case "misc":
          newObject = new SpriteObject();

          switch (source.objectID) {
            case 16: // exit grids

            case 17:
            case 18:
            case 19:
            case 20:
            case 21:
            case 22:
            case 23:
              newObject.exitGrid_map = source.exitMap;
              newObject.exitGrid_pos = source.exitPosition;
              newObject.exitGrid_elev = source.exitElevation;
              newObject.exitGrid_orientation = source.exitOrientation;
              break;

            default:
              break;
          }

          break;

        default:
          newObject = new SpriteObject();
          break;
      }

      newObject.subtypeID = source.subtypeID;
    }

    newObject.itemFlags = source.itemFlags;
    newObject.PID = source.PID;
    newObject.objectTypeID = source.objectTypeID;
    newObject.objectID = source.objectID;
    newObject.FID = source.FID;
    newObject.frmTypeID = source.frmTypeID;
    newObject.frmID = source.frmID;
    newObject.textID = source.textID;
    newObject.inventory = new Array(source.inventorySize);

    for (let m = 0; m < source.inventorySize; m++) {
      newObject.inventory[m] = this.createMapObject(source.inventory[m]);

      if (newObject.inventory[m].objectTypeID == 0) {
        // item
        switch (newObject.inventory[m].subtypeID) {
          case 0:
            // armor
            if (newObject.inventory[m].itemFlags & 0x04000000) {
              newObject.armor = newObject.inventory[m];
            }

            break;

          case 3:
            // weapon
            if (newObject.inventory[m].itemFlags & 0x01000000) {
              // right hand
              newObject.slot1 = newObject.inventory[m];
            }

            if (newObject.inventory[m].itemFlags & 0x02000000) {
              // left hand
              newObject.slot2 = newObject.inventory[m];
            }

            break;

          default:
            break;
        }
      }
    }

    newObject.hexPosition = source.hexPosition;
    newObject.orientation = source.orientation;
    newObject.anim.frameNumber = source.frameNumber;
    this.object_setAnim(newObject, "idle", newObject.anim.frameNumber);
    return newObject;
  }
  /**
   * playAnim differs from setAnim in that behaviors can be set here, this calls setAnim
   * where the img var is generated, and offsets computed.
   * @param {*} obj
   * @param {*} newAnim
   * @param {*} frame
   * @param {*} actionFrame
   * @param {*} dir
   * @param {*} loop
   * @param {*} actionCallback
   * @param {*} endCallback
   */


  object_playAnim(obj = null, newAnim = "idle", frame = 0, actionFrame = 0, dir = 0, loop = false, actionCallback = null, endCallback = null) {
    this.object_setAnim(obj, newAnim, frame, dir, loop, true);
    obj.anim.actionFrame = actionFrame;

    if (actionCallback == endCallback) {
      if (isFunction(actionCallback) && isFunction(endCallback)) this.actor_addAction(obj, actionCallback, "onActionFrame|onAnimEnd");
    } else {
      if (isFunction(actionCallback)) this.actor_addAction(obj, actionCallback, "onActionFrame");
      if (isFunction(endCallback)) this.actor_addAction(obj, endCallback, "onAnimEnd");
    }
  }
  /**
   *
   * @param {*} obj
   * @param {*} newAnim
   * @param {*} frame
   * @param {*} dir
   * @param {*} loop
   * @param {*} active
   */


  object_setAnim(obj = null, newAnim = "idle", frame = 0, dir = 0, loop = false, active = false) {
    obj.anim.currentAnim = newAnim;
    obj.anim.animActive = active;
    obj.anim.animLoop = loop;
    obj.anim.animDirection = dir;
    obj.anim.actionFrame = 0;

    let generateFRMstring = function (object) {
      let frmID = obj.FID & 0x00000FFF;
      let filetype = getObjectType(obj.FID >> 24);

      if (filetype == "critters") {
        let weaponString = "a";
        let animString = "a";
        let frmBase = _assets["art/critters/critters.lst"][frmID].data.base;

        if (object.armorMaleFID || object.armorFemaleFID) {//frmBase = FIDtoFRM(object.armorMaleFID);		// @TODO:WTF
        }

        if (object.slot2) {
          // ?
          weaponString = String.fromCharCode(99 + object.slot2.weaponAnimCode); // d-m
        }

        switch (object.anim.currentAnim) {
          case "idle":
            return "art/critters/" + frmBase + weaponString + "a.frm";

          case "walk":
            return "art/critters/" + frmBase + weaponString + "b.frm";

          case "run":
            return "art/critters/" + frmBase + "at.frm";

          case "use":
            return "art/critters/" + frmBase + "al.frm";

          default:
            return "art/critters/" + frmBase + "aa.frm";
        }
      }

      let filename = _assets["art/" + filetype + "/" + filetype + ".lst"][frmID].data;
      return "art/" + filetype + "/" + filename;
    };

    obj.anim.img = _assets[generateFRMstring(obj)]; // Replace old GenerateFRMPtr

    this.object_setFrame(obj, frame); // reset frame and offset

    if (obj.hasOwnProperty("ai") && newAnim == "idle") {
      // idle
      obj.ai.idleStartTime = getTicks();
    }
  }
  /**
   *
   * @param {*} obj
   * @param {*} frame
   */


  object_setFrame(obj, frame = 0) {
    // Last frame
    if (frame === -1) {
      frame = obj.anim.img.nFrames - 1;
    }

    obj.anim.frameNumber = frame;
    obj.anim.shiftX = obj.anim.img.shift[obj.orientation].x;
    obj.anim.shiftY = obj.anim.img.shift[obj.orientation].y;

    if (!obj.anim.img.frameInfo[obj.orientation]) {
      console.log("MainState: object_setFrame: Orientation error");
      obj.orientation = 0;
      return;
    }

    for (let f = 0; f < obj.anim.frameNumber + 1; f++) {
      // set offsets
      obj.anim.shiftX += obj.anim.img.frameInfo[obj.orientation][f].offsetX;
      obj.anim.shiftY += obj.anim.img.frameInfo[obj.orientation][f].offsetY;
    }
  }
  /**
   *
   * @param {*} actor
   * @param {*} dest
   * @param {*} runState
   * @param {*} pathCompleteCallback
   */


  actor_beginMoveState(actor, dest, runState, pathCompleteCallback) {
    if (actor.ai.moveState) {
      // if already in anim
      this.actor_addActionToFront(actor, () => {
        this.actor_moveStep(actor);
        this.actor_endMoveState(actor);
        this.actor_cancelAction(actor);
        this.actor_beginMoveState(actor, dest, this.inputRunState);
      }, "onAnimEnd|onActionFrame");
      return;
    }

    actor.ai.pathQ = this.findPath(actor.hexPosition, dest);
    if (!actor.ai.pathQ) return;
    actor.ai.moveState = true;
    actor.ai.runState = runState;
    actor.ai.moveDest = dest;
    actor.ai.moveNext = actor.ai.pathQ.shift();
    actor.orientation = findOrientation(actor.hexPosition, actor.ai.moveNext);

    if (actor.ai.runState) {
      // run
      this.object_playAnim(actor, "run", 0, 2, 0, true);
    } else {
      // walk
      this.object_playAnim(actor, "walk", 0, 4, 0, true);
    }

    this.actor_addActionToFront(actor, this.actor_moveStep.bind(this, actor), "onAnimEnd|onActionFrame");
  }
  /**
   *
   * @param {*} actor
   */


  actor_moveStep(actor) {
    actor.hexPosition = actor.ai.moveNext;

    if (actor.hexPosition == actor.ai.moveDest) {
      // destination reached
      this.actor_endMoveState(actor);
      return;
    }

    actor.ai.moveNext = actor.ai.pathQ.shift();
    actor.orientation = findOrientation(actor.hexPosition, actor.ai.moveNext);
    actor.anim.shiftX = actor.anim.img.shift[actor.orientation].x;
    actor.anim.shiftY = actor.anim.img.shift[actor.orientation].y;

    if (actor.ai.runState) {
      switch (actor.anim.actionFrame) {
        case 2:
          actor.anim.actionFrame = 4;
          break;

        case 4:
          actor.anim.actionFrame = 6;
          break;

        case 6:
          actor.anim.actionFrame = 8;
          break;

        case 8:
          actor.anim.actionFrame = 10; // never reached, anim resets before this point.

          break;

        case 10:
          // this will be reset on animation end
          actor.anim.actionFrame = 2;
          break;
      }
    }

    this.actor_addActionToFront(actor, this.actor_moveStep.bind(this, actor), "onAnimEnd|onActionFrame");

    if (actor == this.player) {
      if (this.map.hexMap[actor.currentElevation][actor.hexPosition].exitGrid) {
        // exit map
        this.exitMap(this.map.hexMap[actor.currentElevation][actor.hexPosition].exitGrid_map, this.map.hexMap[actor.currentElevation][actor.hexPosition].exitGrid_pos, this.map.hexMap[actor.currentElevation][actor.hexPosition].exitGrid_elev, this.map.hexMap[actor.currentElevation][actor.hexPosition].exitGrid_orientation);
      }
    }
  }
  /**
   *
   */


  actor_endMoveState(actor) {
    if (!actor.ai.moveState) return;
    actor.ai.moveState = false;
    this.object_setAnim(actor, "idle", 0, 0, false, false);
    actor.anim.actionFrameCallback = 0;
    actor.anim.animEndCallback = 0;
    this.actor_nextAction(actor, "endMoveState");
  }
  /**
   *
   * @param {*} actor
   * @param {*} action
   * @param {*} trigger
   * @param {*} delay
   */


  actor_addAction(actor, action, trigger, delay) {
    if (isFunction(action)) {
      actor.actionQ.push({
        trigger: trigger,
        action: action,
        timeStart: getTicks(),
        delay: delay
      });
    }
  }
  /**
   *
   * @param {*} actor
   * @param {*} action
   * @param {*} trigger
   * @param {*} delay
   */


  actor_addActionToFront(actor, action, trigger, delay) {
    if (isFunction(action)) {
      actor.actionQ.unshift({
        trigger: trigger,
        action: action,
        timeStart: getTicks(),
        delay: delay
      });
    }
  }
  /**
   *
   * @param {*} actor
   */


  actor_checkTimedAction(actor) {
    if (!actor.actionQ.length) {
      return false;
    } // allow logical OR.


    actionTriggers = actor.actionQ[0].trigger.split("|");

    for (let i = 0; i < actionTriggers.length; i++) {
      if (actionTriggers[i] == "timed") {
        let currentTime = getTicks();
        let endTime = actor.actionQ[0].timeStart + actor.actionQ[0].delay * 1000;

        if (currentTime > endTime) {
          let nextAction = actor.actionQ.shift();
          nextAction.action.call(this);
          return true;
        }
      }
    }

    return false;
  }
  /**
   *
   * @param {*} actor
   * @param {*} trigger
   */


  actor_nextAction(actor, trigger) {
    if (!actor.actionQ.length) return false;
    let actionTriggers = actor.actionQ[0].trigger.split("|"); // allow logical OR

    for (let i = 0; i < actionTriggers.length; i++) {
      if (actionTriggers[i] == trigger) {
        let nextAction = actor.actionQ.shift();
        nextAction.action.call(this);
        return true;
      }
    }

    return false;
  }
  /**
   *
   * @param {*} actor
   */


  actor_cancelAction(actor) {
    actor.actionQ = [];
  }
  /**
   *
   * @param {*} obj
   */


  object_openDoor(obj) {
    this.object_playAnim(obj, 0, 0, 0, 0, false, 0, () => {
      obj.openState = 1;
      this.map.hexMap[this.player.currentElevation][obj.hexPosition].blocked = false; // FIX FOR ELEVATION
    });
  }
  /**
   *
   * @param {*} obj
   */


  object_closeDoor(obj) {
    this.object_playAnim(obj, 0, -1, 0, 1, false, 0, () => {
      obj.openState = 0;
      this.map.hexMap[this.player.currentElevation][obj.hexPosition].blocked = true; // FIX FOR ELEVATION
    });
  }

}

;
/**
 * @file rendering.js
 * @author Anthony (ajxs [at] panoptic.online)
 * @brief Rendering functionality.
 * Contains functionality related to rendering.
 */
"use strict";
/**
 * Blits an FRM to a destination rendering context.
 * @param {*} frm
 * @param {*} dest
 * @param {*} dx
 * @param {*} dy
 * @param {*} dir
 * @param {*} frame
 * @param {*} alpha
 */

function blitFRM(frm, dest, dx, dy, dir = 0, frame = 0, alpha = 1) {
  if (!frm) {
    throw new Error("No FRM provided");
  } // Set destination buffer alpha.


  dest.globalAlpha = alpha;
  dest.drawImage(frm.img, frm.frameInfo[dir][frame].atlasX, frm.frameInfo[dir][frame].atlasY, frm.frameInfo[dir][frame].width, frm.frameInfo[dir][frame].height, dx, dy, frm.frameInfo[dir][frame].width, frm.frameInfo[dir][frame].height); // Reset destination buffer alpha.

  dest.globalAlpha = 1;
}
/**
 * Blits an FRM outline to a destination rendering context.
 * @param {*} frm
 * @param {*} dest
 * @param {*} dx
 * @param {*} dy
 * @param {*} dir
 * @param {*} frame
 * @param {*} outlineColor
 * @param {*} outlineAlpha
 */


function blitFRMOutline(frm, dest, dx, dy, dir = 0, frame = 0, outlineColor = null, outlineAlpha = 1) {
  if (!frm) {
    throw new Error("No FRM provided");
  }
  /** The string used to reference the FRM outline. */


  const frmString = `img_outline_${outlineColor}`; // Set the destination buffer alpha.

  dest.globalAlpha = outlineAlpha; // If the outline does not exist, create it.

  if (!frm[frmString]) {
    createFRMOutline(frm, outlineColor);
  }

  dest.drawImage(frmString, frm.frameInfo_outline[dir][frame].atlasX, frm.frameInfo_outline[dir][frame].atlasY, frm.frameInfo_outline[dir][frame].width, frm.frameInfo_outline[dir][frame].height, dx - 1, // Outline is offset by 1 pixel.
  dy - 1, frm.frameInfo_outline[dir][frame].width, frm.frameInfo_outline[dir][frame].height); // Reset destination buffer alpha.

  dest.globalAlpha = 1;
}

const createFRMOutline_shadowColor = 12;
/**
 * Creates an FRM outline asset for a specified FRM.
 * @param {*} frm - The FRM to create the outline for.
 * @param {*} color - The color for the outline.
 */

function createFRMOutline(frm, color = "#FF0000") {
  console.log("creating " + color + " outline FRM img for: " + frm);
  let outlines = new Array(frm.frameInfo.length);
  let maxHeight = 0;
  let maxWidth = 0;

  for (let dir = 0; dir < frm.frameInfo.length; dir++) {
    outlines[dir] = new Array(frm.nFrames);

    for (let f = 0; f < frm.nFrames; f++) {
      const outlineCanvas = document.createElement('canvas');
      outlineCanvas.width = frm.frameInfo[dir][f].width + 2;
      outlineCanvas.height = frm.frameInfo[dir][f].height + 2;
      const outlineContext = outlineCanvas.getContext('2d');
      outlineContext.imageSmoothingEnabled = false;
      const trimmedCanvas = document.createElement('canvas'); // Trim off shadow then reblit

      trimmedCanvas.width = frm.frameInfo[dir][f].width + 2;
      trimmedCanvas.height = frm.frameInfo[dir][f].height + 2;
      const trimmedContext = trimmedCanvas.getContext('2d');
      trimmedCanvas.imageSmoothingEnabled = false;
      trimmedContext.globalCompositeOperation = 'source-over';
      trimmedContext.drawImage(frm.img, frm.frameInfo[dir][f].atlasX, frm.frameInfo[dir][f].atlasY, frm.frameInfo[dir][f].width, frm.frameInfo[dir][f].height, 1, 1, frm.frameInfo[dir][f].width, frm.frameInfo[dir][f].height);
      const trimmedData = trimmedContext.getImageData(0, 0, frm.frameInfo[dir][f].width + 2, frm.frameInfo[dir][f].height + 2);
      let x = null;
      let y = null;
      outlineContext.fillStyle = color;

      for (let i = 0, imgDataLength = trimmedData.data.length; i < imgDataLength; i += 4) {
        if (trimmedData.data[i + 3] > 0) {
          x = i / 4 % (frm.frameInfo[dir][f].width + 2);
          y = i / 4 / (frm.frameInfo[dir][f].width + 2) | 0;
          outlineContext.fillRect(x - 1, y - 1, 3, 3);
        }
      }

      const imgData = outlineContext.getImageData(0, 0, frm.frameInfo[dir][f].width + 2, frm.frameInfo[dir][f].height + 2);

      for (let i = 0, imgDataLength = trimmedData.data.length; i < imgDataLength; i += 4) {
        if (trimmedData.data[i + 3] > 0) imgData.data[i + 3] = 0;
      }

      outlineContext.putImageData(imgData, 0, 0);
      maxWidth += frm.frameInfo[dir][f].width + 2;
      if (frm.frameInfo[dir][f].height + 2 > maxHeight) maxHeight = frm.frameInfo[dir][f].height + 2;
      outlines[dir][f] = outlineCanvas;
    }
  }

  let total = document.createElement('canvas');
  let totalContext = total.getContext('2d');
  total.width = maxWidth;
  total.height = maxHeight;
  let currentX = 0;
  let outlineInfo = new Array(frm.frameInfo.length);

  for (let dir = 0; dir < frm.frameInfo.length; dir++) {
    outlineInfo[dir] = new Array(frm.nFrames);

    for (let f = 0; f < frm.nFrames; f++) {
      totalContext.drawImage(outlines[dir][f], currentX, 0);
      outlineInfo[dir][f] = {
        atlasX: currentX,
        atlasY: 0,
        width: frm.frameInfo[dir][f].width + 2,
        height: frm.frameInfo[dir][f].height + 2,
        offsetX: frm.frameInfo[dir][f].offsetX,
        offsetY: frm.frameInfo[dir][f].offsetY
      };
      currentX += frm.frameInfo[dir][f].width + 2;
    }
  }

  frm['img_outline_' + color] = total;
  frm.frameInfo_outline = outlineInfo;
}

function createFontOutlineImg(_font, _outlineColor) {
  let maxHeight = 0;
  let maxWidth = 0;
  let currentX = 0;

  let symbolInfo_outline = _font.symbolInfo.map(function (symbol) {
    if (symbol.width == 0 || symbol.height == 0) {
      return {
        width: 0,
        height: 0
      };
    }

    if (symbol.height + 2 > maxHeight) {
      maxHeight = symbol.height + 2;
    }

    currentX = maxWidth;
    maxWidth += symbol.width + 2;
    return {
      x: currentX,
      y: 0,
      width: symbol.width + 2,
      height: symbol.height + 2
    };
  });

  let outlineCanvas = document.createElement('canvas');
  let outlineContext = outlineCanvas.getContext('2d');
  outlineCanvas.width = maxWidth;
  outlineCanvas.height = maxHeight;

  for (let i = 0; i < symbolInfo_outline.length; i++) {
    outlineContext.drawImage(_font.img, _font.symbolInfo[i].x, _font.symbolInfo[i].y, _font.symbolInfo[i].width, _font.symbolInfo[i].height, symbolInfo_outline[i].x + 1, symbolInfo_outline[i].y + 1, _font.symbolInfo[i].width, _font.symbolInfo[i].height);
  }

  const imgData = outlineContext.getImageData(0, 0, outlineCanvas.width, outlineCanvas.height);
  outlineContext.fillStyle = _outlineColor;
  let x;
  let y;

  for (let i = 0, imgDataLength = imgData.data.length; i < imgDataLength; i += 4) {
    if (imgData.data[i + 3] > 0) {
      x = i / 4 % outlineCanvas.width;
      y = i / 4 / outlineCanvas.width | 0;
      outlineContext.fillRect(x - 1, y - 1, 3, 3);
    }
  }

  _font.symbolInfo_outline = symbolInfo_outline;
  _font["img_outline_" + _outlineColor] = outlineCanvas;
}
/**
 * Blits a font string to a destination rendering context.
 * @param {*} _font
 * @param {*} _dest
 * @param {*} _string
 * @param {*} _x
 * @param {*} _y
 * @param {*} _color
 * @param {*} _outlineColor
 */


function blitFontString(_font, _dest, _string, _x, _y, _color = null, _outlineColor = null) {
  // hack fix for firefox race condition bug.
  if (_font.img.width == 0 || _font.img.height == 0) {
    return;
  }
  /** The string used to reference the FRM. */


  const frmString = `img_${_color}`;
  let rF_stringlength = _string.length;
  let rF_symbolIndex = 0;
  let rF_totalWidth = 0;
  let rF_baseline = _y + _font.height;
  let rF_img = 0;

  if (_color) {
    // if no colorized img, create one.
    if (!_font.hasOwnProperty(frmString)) {
      console.log("Bitmap Font: call to font render for surface without color: ", _color);
      createFontColorImg(_font, _color);
    }

    rF_img = _font[frmString];
  } else rF_img = _font.img;

  if (_outlineColor) {
    // if no colorized img, create one.
    if (!_font.hasOwnProperty("img_outline_" + _outlineColor)) {
      console.log("Bitmap Font: call to font render for surface without outline color: ", _outlineColor);
      createFontOutlineImg(_font, _outlineColor);
    }
  }

  for (let i = 0; i < rF_stringlength; i++) {
    rF_symbolIndex = _string.charCodeAt(i);

    if (rF_symbolIndex == 32) {
      // space
      rF_totalWidth += _font.symbolInfo[32].width;
    } else {
      if (!_font.symbolInfo[rF_symbolIndex].width) {
        continue;
      }

      if (_outlineColor) {
        _dest.drawImage(_font["img_outline_" + _outlineColor], _font.symbolInfo_outline[rF_symbolIndex].x, _font.symbolInfo_outline[rF_symbolIndex].y, _font.symbolInfo_outline[rF_symbolIndex].width, _font.symbolInfo_outline[rF_symbolIndex].height, _x + rF_totalWidth - 1, rF_baseline - _font.symbolInfo_outline[rF_symbolIndex].height + 1, _font.symbolInfo_outline[rF_symbolIndex].width, _font.symbolInfo_outline[rF_symbolIndex].height);
      }

      _dest.drawImage(rF_img, _font.symbolInfo[rF_symbolIndex].x, _font.symbolInfo[rF_symbolIndex].y, _font.symbolInfo[rF_symbolIndex].width, _font.symbolInfo[rF_symbolIndex].height, _x + rF_totalWidth, rF_baseline - _font.symbolInfo[rF_symbolIndex].height, _font.symbolInfo[rF_symbolIndex].width, _font.symbolInfo[rF_symbolIndex].height);

      rF_totalWidth += _font.symbolInfo[rF_symbolIndex].width + _font.gapSize;
    }
  }
}
/**
 * Creates canvas element with coloured font.
 * @TODO - "create check so that you can't create duplicate rgb(r,g,b) and #rgb
 * versions by accident. Potentially force hex colors as argument.
 * @param {*} _font
 * @param {*} _color
 */


function createFontColorImg(_font, _color) {
  console.log("Font: Creating color surface: " + _color);
  /** The string used to reference the FRM. */

  const frmString = `img_${_color}`; // If the font color image already exists, exit.

  if (_font[frmString]) {
    return;
  } // Create the base color image as a canvas element.


  _font[frmString] = document.createElement("canvas");
  _font[frmString].width = _font.img.width;
  _font[frmString].height = _font.img.height;

  const _fontContext = _font[frmString].getContext("2d");

  if (_font.type == "fon") {
    _fontContext.globalCompositeOperation = "source-over";
    _fontContext.fillStyle = _color;

    _fontContext.fillRect(0, 0, _font[frmString].width, _font[frmString].height);

    _fontContext.globalCompositeOperation = "destination-in";

    _fontContext.drawImage(_font.img, 0, 0);
  } else {
    _fontContext.globalCompositeOperation = "source-over";

    _fontContext.drawImage(_font.img, 0, 0);

    const imgData1 = _fontContext.getImageData(0, 0, _font.img.width, _font.img.height);

    _fontContext.globalCompositeOperation = "source-in";
    _fontContext.fillStyle = _color;

    _fontContext.fillRect(0, 0, _font[frmString].width, _font[frmString].height);

    const imgData2 = _fontContext.getImageData(0, 0, _font.img.width, _font.img.height);

    for (let i = 0; i < imgData2.data.length; i += 4) {
      // AAF 0-9 values act as alpha blend.
      imgData2.data[i + 3] = imgData1.data[i];
    }

    _fontContext.putImageData(imgData2, 0, 0);
  }
}
"use strict";

let vm = {
  paused: false,
  procAddress: 0,
  script: 0,
  INTFile: 0,
  dataStack: [],
  retStack: [],

  op(op = null) {
    return {
      0xC001: () => {
        //this.push(this.script.read32())
        console.log("0xC001");
      },
      0x800D: () => {//this.retStack.push(this.pop())
      },
      0x800C: () => {//this.push(this.popAddr()) 	 // op_a_to_d
      },
      0x801A: () => {
        // op_pop
        this.pop();
      },
      0x8004: () => {// op_jmp
        //this.pc = this.pop()
      }
    }[op] || null;
  },

  loadScript(script, INTFile) {
    this.script = script;
    this.INTFile = INTFile;
  },

  push: function (val) {
    this.dataStack.push(val);
  },
  pop: function () {
    if (this.dataStack.length === 0) {
      return this.dataStack.pop();
    } else {
      console.log("ScriptVM: pop: stack underflow");
      return null;
    }
  },
  call: function (procName, args) {
    var proc = this.INTFile.procedures[procName]; // console.log("CALL " + procName + " @ " + proc.offset + " from " + this.scriptObj.scriptName)

    if (!proc) {}
  },
  step: function () {
    if (this.paused) return false;
    var procAddress = this.procAddress;
    var opCode = this.INTFile.body[procAddress];
  },
  run: function () {
    this.paused = false;

    while (this.step());
  }
};
"use strict";

class CharacterScreenState extends GameState {
  constructor() {
    super();
    this.activeItem = -1;
    this.mouseState = -1;
    this.activeMenu = -1;
    this.selectedItem = -1;
    this.activeTab = "perks";
    this.skillImage = "art/skilldex/morecrit.frm";
    this.x = 0;
    this.y = 0;
    this.interface = new Interface("jsfdata/interface/charScreenInterface.json");
  }

  input(e) {
    switch (e.type) {
      case "mousedown":
        this.mouseState = 1;
        break;

      case "mouseup":
        this.mouseState = 0;

        switch (this.interface.clickHandler()) {
          case "printButton":
            //this.activeItem = -1;	// reset this so that it mouse event doesn't propagate through on reopen
            break;

          case "doneButton":
            main_gameStateFunction('closeCharacterScreen');
            break;

          case "cancelButton":
            main_gameStateFunction('closeCharacterScreen');
            break;

          case "perksTab":
            this.activeTab = "perks";
            break;

          case "karmaTab":
            this.activeTab = "karma";
            break;

          case "killsTab":
            this.activeTab = "kills";
            break;

          case "smallGunsButton":
            this.selectedItem = "smallGunsButton";
            this.slider.y = this.smallGunsButton.y - 11;
            break;

          case "bigGunsButton":
            this.selectedItem = "bigGunsButton";
            this.slider.y = this.bigGunsButton.y - 11;
            break;

          case "energyWeaponsButton":
            this.selectedItem = "energyWeaponsButton";
            this.slider.y = this.energyWeaponsButton.y - 11;
            break;

          case "unarmedButton":
            this.selectedItem = "unarmedButton";
            this.slider.y = this.unarmedButton.y - 11;
            break;

          case "meleeWeaponsButton":
            this.selectedItem = "meleeWeaponsButton";
            this.slider.y = this.meleeWeaponsButton.y - 11;
            break;

          case "throwingButton":
            this.selectedItem = "throwingButton";
            this.slider.y = this.throwingButton.y - 11;
            break;

          case "firstAidButton":
            this.selectedItem = "firstAidButton";
            this.slider.y = this.firstAidButton.y - 11;
            break;

          case "doctorButton":
            this.selectedItem = "doctorButton";
            this.slider.y = this.doctorButton.y - 11;
            break;

          case "sneakButton":
            this.selectedItem = "sneakButton";
            this.slider.y = this.sneakButton.y - 11;
            break;

          case "lockpickButton":
            this.selectedItem = "lockpickButton";
            this.slider.y = this.lockpickButton.y - 11;
            break;

          case "stealButton":
            this.selectedItem = "stealButton";
            this.slider.y = this.stealButton.y - 11;
            break;

          case "trapsButton":
            this.selectedItem = "trapsButton";
            this.slider.y = this.trapsButton.y - 11;
            break;

          case "scienceButton":
            this.selectedItem = "scienceButton";
            this.slider.y = this.scienceButton.y - 11;
            break;

          case "repairButton":
            this.selectedItem = "repairButton";
            this.slider.y = this.repairButton.y - 11;
            break;

          case "speechButton":
            this.selectedItem = "speechButton";
            this.slider.y = this.speechButton.y - 11;
            break;

          case "barterButton":
            this.selectedItem = "barterButton";
            this.slider.y = this.barterButton.y - 11;
            break;

          case "gamblingButton":
            this.selectedItem = "gamblingButton";
            this.slider.y = this.gamblingButton.y - 11;
            break;

          case "outdoorsmanButton":
            this.selectedItem = "outdoorsmanButton";
            this.slider.y = this.outdoorsmanButton.y - 11;
            break;

          case "strengthButton":
            this.selectedItem = "strengthButton";
            break;

          case "perceptionButton":
            this.selectedItem = "perceptionButton";
            break;

          case "enduranceButton":
            this.selectedItem = "enduranceButton";
            break;

          case "charismaButton":
            this.selectedItem = "charismaButton";
            break;

          case "intelligenceButton":
            this.selectedItem = "intelligenceButton";
            break;

          case "agilityButton":
            this.selectedItem = "agilityButton";
            break;

          case "luckButton":
            this.selectedItem = "luckButton";
            break;

          case "armorClassButton":
            this.selectedItem = "armorClassButton";
            break;

          case "actionPointsButton":
            this.selectedItem = "actionPointsButton";
            break;

          case "carryWeightButton":
            this.selectedItem = "carryWeightButton";
            break;

          case "meleeDamageButton":
            this.selectedItem = "meleeDamageButton";
            break;

          case "damageResButton":
            this.selectedItem = "damageResButton";
            break;

          case "poisonResButton":
            this.selectedItem = "poisonResButton";
            break;

          case "radiationResButton":
            this.selectedItem = "radiationResButton";
            break;

          case "sequenceButton":
            this.selectedItem = "sequenceButton";
            break;

          case "healingRateButton":
            this.selectedItem = "healingRateButton";
            break;

          case "criticalChanceButton":
            this.selectedItem = "criticalChanceButton";
            break;

          case "levelButton":
            this.selectedItem = "levelButton";
            break;

          case "expButton":
            this.selectedItem = "expButton";
            break;

          case "nextLevelButton":
            this.selectedItem = "nextLevelButton";
            break;
        }

        break;

      default:
        break;
    }

    ;
  }

  update() {
    //@TODO: FIX THIS MESS
    this.interface.update();
  }

  render() {
    _context.globalAlpha = 1;
    blitFRM(_assets["art/intrface/edtredt.frm"], // background
    _context, this.x, this.y);

    if (this.skillImage) {
      blitFRM(_assets[this.skillImage], // background
      _context, this.x + 484, this.y + 309);
    }

    blitFRM(_assets["art/intrface/nameoff.frm"], _context, this.x + 9, this.y);
    blitFRM(_assets["art/intrface/ageoff.frm"], _context, this.x + 154, this.y);
    blitFRM(_assets["art/intrface/sexoff.frm"], _context, this.x + 235, this.y);

    switch (this.activeTab) {
      case "perks":
        blitFRM(_assets["art/intrface/perksfdr.frm"], _context, this.x + 11, this.y + 327);
        blitFontString(_assets["font1.aaf"], "" + "--------------- TRAITS ---------------", this.x + 34, this.y + 364, "#00FF00");
        break;

      case "karma":
        blitFRM(_assets["art/intrface/karmafdr.frm"], _context, this.x + 11, this.y + 327);
        break;

      case "kills":
        blitFRM(_assets["art/intrface/killsfdr.frm"], _context, this.x + 11, this.y + 327);
        break;
    }

    blitFontString(_assets["font3.aaf"], "PERKS", this.x + 46, this.y + (this.activeTab == "perks") ? 332 : 333, this.activeTab == "perks" ? "#907824" : "#806814");
    blitFontString(_assets["font3.aaf"], "KARMA", this.x + 141, this.y + (this.activeTab == "karma") ? 332 : 333, this.activeTab == "karma" ? "#907824" : "#806814");
    blitFontString(_assets["font3.aaf"], "KILLS", this.x + 246, this.y + (this.activeTab == "kills") ? 332 : 333, this.activeTab == "kills" ? "#907824" : "#806814");
    blitFontString(_assets["font3.aaf"], mainState.player.name, this.x + 30, this.y + 6, "#907824");
    blitFontString(_assets["font3.aaf"], "AGE " + mainState.player.age, this.x + 167, this.y + 6, "#907824");
    blitFontString(_assets["font3.aaf"], mainState.player.sex, this.x + 254, this.y + 6, "#907824");
    blitFontString(_assets["font3.aaf"], "PRINT", 364, 454, "#907824");
    blitFontString(_assets["font3.aaf"], "DONE", 476, 454, "#907824");
    blitFontString(_assets["font3.aaf"], "CANCEL", 572, 454, "#907824");
    blitFontString(_assets["font3.aaf"], "SKILLS", 380, 5, "#907824");
    blitFontString(_assets["font3.aaf"], "SKILL POINTS", 400, 233, "#907824");
    blitFontString(_assets["font1.aaf"], "Level: 2", 32, 280, this.selectedItem == "levelButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Exp: 1,999", 32, 291, this.selectedItem == "expButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Next Level: 2000", 32, 302, this.selectedItem == "nextLevelButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Hit Points 29/34", this.x + 194, this.y + 46, this.selectedItem == "hitPointsButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Poisoned", this.x + 194, this.y + 59, "#183018");
    blitFontString(_assets["font1.aaf"], "Radiated", this.x + 194, this.y + 72, "#183018");
    blitFontString(_assets["font1.aaf"], "Eye Damage", this.x + 194, this.y + 85, "#183018");
    blitFontString(_assets["font1.aaf"], "Crippled Right Arm", this.x + 194, this.y + 98, "#183018");
    blitFontString(_assets["font1.aaf"], "Crippled Left Arm", this.x + 194, this.y + 111, "#183018");
    blitFontString(_assets["font1.aaf"], "Crippled Right Leg", this.x + 194, this.y + 124, "#183018");
    blitFontString(_assets["font1.aaf"], "Crippled Left Leg", this.x + 194, this.y + 137, "#183018");
    blitFontString(_assets["font1.aaf"], "Armor Class", 194, 179, this.selectedItem == "armorClassButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Action Points", 194, 192, this.selectedItem == "actionPointsButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Carry Weight", 194, 205, this.selectedItem == "carryWeightButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Melee Damage", 194, 218, this.selectedItem == "meleeDamageButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Damage Res.", 194, 231, this.selectedItem == "damageResButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Poison Res.", 194, 244, this.selectedItem == "poisonResButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Radiation Res.", 194, 257, this.selectedItem == "radiationResButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Sequence", 194, 270, this.selectedItem == "sequenceButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Healing Rate", 194, 283, this.selectedItem == "healingRateButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Critical Chance", 194, 296, this.selectedItem == "criticalChanceButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "" + mainState.player.stats["armorClass"].level, 288, 179, this.selectedItem == "armorClassButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "" + mainState.player.stats["actionPoints"].level, 288, 192, this.selectedItem == "actionPointsButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "" + mainState.player.stats["carryWeight"].level, 288, 205, this.selectedItem == "carryWeightButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "" + mainState.player.stats["meleeDamage"].level, 288, 218, this.selectedItem == "meleeDamageButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "" + mainState.player.stats["damageRes"].level, 288, 231, this.selectedItem == "damageResButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "" + mainState.player.stats["poisonRes"].level, 288, 244, this.selectedItem == "poisonResButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "" + mainState.player.stats["radiationRes"].level, 288, 257, this.selectedItem == "radiationResButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "" + mainState.player.stats["sequence"].level, 288, 270, this.selectedItem == "sequenceButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "" + mainState.player.stats["healingRate"].level, 288, 283, this.selectedItem == "healingRateButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "" + mainState.player.stats["criticalChance"].level, 288, 296, this.selectedItem == "criticalChanceButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Small Guns", 380, 27, this.selectedItem == "smallGunsButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Big Guns", 380, 38, this.selectedItem == "bigGunsButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Energy Weapons", 380, 49, this.selectedItem == "energyWeaponsButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Unarmed", 380, 60, this.selectedItem == "unarmedButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Melee Weapons", 380, 71, this.selectedItem == "meleeWeaponsButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Throwing", 380, 82, this.selectedItem == "throwingButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "First Aid", 380, 93, this.selectedItem == "firstAidButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Doctor", 380, 104, this.selectedItem == "doctorButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Sneak", 380, 115, this.selectedItem == "sneakButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Lockpick", 380, 126, this.selectedItem == "lockpickButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Steal", 380, 137, this.selectedItem == "stealButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Traps", 380, 148, this.selectedItem == "trapsButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Science", 380, 159, this.selectedItem == "scienceButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Repair", 380, 170, this.selectedItem == "repairButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Speech", 380, 181, this.selectedItem == "speechButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Barter", 380, 192, this.selectedItem == "barterButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Gambling", 380, 203, this.selectedItem == "gamblingButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Outdoorsman", 380, 214, this.selectedItem == "outdoorsmanButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], mainState.player.skills["Small Guns"].level + "%", 573, 27, this.selectedItem == "smallGunsButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], mainState.player.skills["Big Guns"].level + "%", 573, 38, this.selectedItem == "bigGunsButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], mainState.player.skills["Energy Weapons"].level + "%", 573, 49, this.selectedItem == "energyWeaponsButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], mainState.player.skills["Unarmed"].level + "%", 573, 60, this.selectedItem == "unarmedButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], mainState.player.skills["Melee Weapons"].level + "%", 573, 71, this.selectedItem == "meleeWeaponsButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], mainState.player.skills["Throwing"].level + "%", 573, 82, this.selectedItem == "throwingButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], mainState.player.skills["First Aid"].level + "%", 573, 93, this.selectedItem == "firstAidButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], mainState.player.skills["Doctor"].level + "%", 573, 104, this.selectedItem == "doctorButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], mainState.player.skills["Sneak"].level + "%", 573, 115, this.selectedItem == "sneakButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], mainState.player.skills["Lockpick"].level + "%", 573, 126, this.selectedItem == "lockpickButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], mainState.player.skills["Steal"].level + "%", 573, 137, this.selectedItem == "stealButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], mainState.player.skills["Traps"].level + "%", 573, 148, this.selectedItem == "trapsButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], mainState.player.skills["Science"].level + "%", 573, 159, this.selectedItem == "scienceButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], mainState.player.skills["Repair"].level + "%", 573, 170, this.selectedItem == "repairButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], mainState.player.skills["Speech"].level + "%", 573, 181, this.selectedItem == "speechButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], mainState.player.skills["Barter"].level + "%", 573, 192, this.selectedItem == "barterButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], mainState.player.skills["Gambling"].level + "%", 573, 203, this.selectedItem == "gamblingButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], mainState.player.skills["Outdoorsman"].level + "%", 573, 214, this.selectedItem == "outdoorsmanButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Great", 103, 45, this.selectedItem == "strengthButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Great", 103, 78, this.selectedItem == "perceptionButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Great", 103, 111, this.selectedItem == "enduranceButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Great", 103, 144, this.selectedItem == "charismaButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Great", 103, 177, this.selectedItem == "intelligenceButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Great", 103, 210, this.selectedItem == "agilityButton" ? "#fcfc7c" : "#00FF00");
    blitFontString(_assets["font1.aaf"], "Great", 103, 243, this.selectedItem == "luckButton" ? "#fcfc7c" : "#00FF00");
    /* _context.drawImage(_assets["art/intrface/slider.frm"].frameInfo[0][0].img, this.x + this.slider.x, this.y + this.slider.y);
    		_context.drawImage((this.activeItem == "doneButton" && this.mouseState == 1) ? _assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img : _assets["art/intrface/lilredup.frm"].frameInfo[0][0].img,
    	this.doneButton.x, this.doneButton.y);	// bg
    _context.drawImage((this.activeItem == "cancelButton" && this.mouseState == 1) ? _assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img : _assets["art/intrface/lilredup.frm"].frameInfo[0][0].img,
    	this.cancelButton.x, this.cancelButton.y);	// bg
    _context.drawImage((this.activeItem == "printButton" && this.mouseState == 1) ? _assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img : _assets["art/intrface/lilredup.frm"].frameInfo[0][0].img,
    	this.printButton.x, this.printButton.y);	// bg */

    blitFRM(_assets["art/intrface/stdarrow.frm"], // cursor
    _context, _mouse.x, _mouse.y);
  }

}

;
"use strict";

class ContextMenuState extends GameState {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.targetItem = 0;
    this.activeItems = [];
    this.objectIndex = 0;
    console.log("ContextMenuState: menuItems init");
    this.menu = {
      talk: {
        img: "art/intrface/talkn.frm",
        hoverImg: "art/intrface/talkh.frm",
        action: "talk"
      },
      look: {
        img: "art/intrface/lookn.frm",
        hoverImg: "art/intrface/lookh.frm",
        action: "look"
      },
      use: {
        img: "art/intrface/usegetn.frm",
        hoverImg: "art/intrface/usegeth.frm",
        action: "use"
      },
      push: {
        img: "art/intrface/pushn.frm",
        hoverImg: "art/intrface/pushh.frm",
        action: "push"
      },
      rotate: {
        img: "art/intrface/rotaten.frm",
        hoverImg: "art/intrface/rotateh.frm",
        action: "rotate"
      },
      cancel: {
        img: "art/intrface/canceln.frm",
        hoverImg: "art/intrface/cancelh.frm",
        action: "cancel"
      },
      inventory: {
        img: "art/intrface/invenn.frm",
        hoverImg: "art/intrface/invenh.frm",
        action: "cancel"
      },
      skill: {
        img: "art/intrface/skilln.frm",
        hoverImg: "art/intrface/skillh.frm",
        action: "skill"
      },
      get: {
        img: "art/intrface/usegetn.frm",
        hoverImg: "art/intrface/usegeth.frm",
        action: "get"
      }
    };
  }

  setMenuItems(obj, x, y) {
    this.objectIndex = obj; //@TODO: Fix this to decouple

    this.x = x;
    this.y = y;
    this.prevX = _mouse.x;
    this.prevY = _mouse.y;
    this.activeItems = []; // reset active items

    let targetObject = mainState.mapObjects[mainState.player.currentElevation][obj];

    switch (getObjectType(targetObject.objectTypeID)) {
      case "items":
        this.activeItems.push(this.menu.get);
        this.activeItems.push(this.menu.look);
        this.activeItems.push(this.menu.inventory);
        this.activeItems.push(this.menu.skill);
        break;

      case "critters":
        this.activeItems.push(this.menu.talk);
        this.activeItems.push(this.menu.look);
        this.activeItems.push(this.menu.inventory);
        this.activeItems.push(this.menu.skill);
        break;

      case "scenery":
      case "walls":
      case "tiles":
      case "misc":
        this.activeItems.push(this.menu.look);
        break;

      default:
        break;
    }

    if (targetObject.hasOwnProperty('openState')) {
      // if door
      this.activeItems.unshift(this.menu.use);
    }

    this.activeItems.push(this.menu.cancel);
  }

  input(e) {
    switch (e.type) {
      case "mouseup":
        mainState.contextMenuAction(this.activeItems[this.targetItem].action, this.objectIndex); // context menu action

        _mouse.x = this.prevX; // reset to previous stored mouse location

        _mouse.y = this.prevY;
        main_gameStateFunction('closeContextMenu');
        break;

      default:
        return;
    }

    ;
  }

  update() {
    this.targetItem = Math.max(0, Math.min((_mouse.y - this.y) / 10 | 0, this.activeItems.length - 1)); // context menu action
  }

  render() {
    for (var c = 0; c < this.activeItems.length; c++) {
      blitFRM(c == this.targetItem ? _assets[this.activeItems[c].hoverImg] : _assets[this.activeItems[c].img], _context, this.x, this.y + 40 * c);
    }

    blitFRM(_assets["art/intrface/actarrow.frm"], _context, this.prevX, this.prevY);
  }

}

;
"use strict";

class IngameMenuState extends GameState {
  constructor() {
    super();
    this.interface = new Interface('jsfdata/interface/inGameMenuInterface.json');
  }

  input(e) {
    switch (e.type) {
      case "keydown":
        if (_keyboard['Escape']) {
          main_gameStateFunction('closeIngameMenu');
          return;
        }

        break;

      case "mousedown":
        break;

      case "mouseup":
        switch (this.interface.clickHandler()) {
          case "return":
            main_gameStateFunction("closeIngameMenu");
            break;

          default:
            break;
        }

        ;
        break;
    }

    ;
  }

  update() {
    this.interface.update();
  }

  render() {
    blitFRM(_assets["art/intrface/opbase.frm"], _context, this.interface.x, this.interface.y);

    for (var i = 0; i < this.interface.elements.length; i++) {
      blitFRM(this.interface.activeItem == i && this.interface.mouseState ? _assets["art/intrface/opbtnon.frm"] : _assets["art/intrface/opbtnoff.frm"], _context, this.interface.x + this.interface.elements[i].x, this.interface.y + this.interface.elements[i].y);
      blitFontString(_assets["font3.aaf"], _context, this.interface.elements[i].text, this.interface.x + this.interface.elements[i].x + this.interface.elements[i].textX, this.interface.y + this.interface.elements[i].y + this.interface.elements[i].textY, this.interface.activeItem == i && this.interface.mouseState ? "#907824" : "#806814");
    }

    blitFRM(_assets["art/intrface/stdarrow.frm"], _context, _mouse.x, _mouse.y);
  }

}

;
"use strict";

class InventoryState extends GameState {
  constructor() {
    super();
    this.x = (SCREEN_WIDTH / 2 | 0) - 250;
    this.y = 0;
    this.playerAnimLastRotationTime = getTicks();
    this.activeItem = -1;
    this.mouseState = -1;
    this.playerAnimLastRotationTime = 0;
    this.playerAnimOrientation = 0;
    this.closeButton = {
      x: 437,
      y: 328,
      width: 15,
      height: 16
    };
  }

  input(e) {
    switch (e.type) {
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
        switch (this.activeItem) {
          case "closeButton":
            main_gameStateFunction('closeInventory');
            this.activeItem = -1; // reset this so that it mouse event doesn't propagate through on reopen

            break;
        }

        break;

      case 'contextmenu':
        // switch input modes on mouse2
        break;
    }

    ;
  }

  update() {
    if (getTicks() - this.playerAnimLastRotationTime > 350) {
      if (this.playerAnimOrientation < 5) this.playerAnimOrientation++;else this.playerAnimOrientation = 0;
      this.playerAnimLastRotationTime = getTicks();
    }

    this.activeItem = -1;

    if (intersectTest(_mouse.x, _mouse.y, 0, 0, this.x + this.closeButton.x, this.y + this.closeButton.y, this.closeButton.width, this.closeButton.height)) {
      this.activeItem = "closeButton";
      return;
    }
  }

  render() {
    _context.globalAlpha = 1;

    _context.drawImage(_assets["art/intrface/invbox.frm"].frameInfo[0][0].img, this.x, this.y); // bg


    _context.drawImage(this.activeItem == "closeButton" && this.mouseState == 1 ? _assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img : _assets["art/intrface/lilredup.frm"].frameInfo[0][0].img, this.x + this.closeButton.x, this.y + this.closeButton.y); // bg


    _context.drawImage(mainState.player.anim.img.frameInfo[this.playerAnimOrientation][0].img, this.x + 190 + mainState.player.anim.img.shift[this.playerAnimOrientation].x, this.y + 45 + mainState.player.anim.img.shift[this.playerAnimOrientation].y);

    _context.drawImage(_assets["art/intrface/hand.frm"].frameInfo[0][0].img, _mouse.x, _mouse.y); // cursor

  }

}

;
"use strict";

class LoadState extends GameState {
  constructor() {
    super();
    this.loadImage = 0;
    this.overlay = document.getElementById("loadState_overlay");
    this.loadPercentage = 0;
  }

  init(_saveState) {
    // use arguments here to pass saved state data.
    console.log("LoadState: loading locally");
    main_loadJsonPayload("jsfdata/" + _saveState.map.split(".")[0] + ".jsf").then(res => {
      console.log("MainLoadState: download complete - parsing loadData");
      asset_parseLoadData(res);

      var createAssetPointers = function (type) {
        _assets["art/" + type + "/" + type + ".lst"].forEach(item => {
          item.ptr = _assets["art/" + type + "/" + item.data];
        });
      };

      createAssetPointers("tiles");
      createAssetPointers("items");
      createAssetPointers("scenery");
      createAssetPointers("misc");
      console.log("LoadState: load complete");
      main_gameStateFunction("main_initGameState", {
        saveState: _saveState
      });
    }).catch(main_payloadError);
  }

  render() {
    // @TODO: REMOVE
    _context.globalAlpha = 1;
    _context.fillStyle = "rgb(0,10,0)";

    _context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    var fullWidth = SCREEN_WIDTH / 2 | 0;
    var barWidth = fullWidth * this.loadPercentage;
    var barX = fullWidth - fullWidth / 2 | 0;
    var barY = SCREEN_HEIGHT - 128;

    _context.drawImage(this.overlay, 0, 0, 1024, 768, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    _context.fillStyle = "rgb(0,10,0)";

    _context.fillRect(barX, barY, fullWidth, 64);

    _context.beginPath();

    _context.moveTo(barX - 6, barY - 6);

    _context.lineTo(barX - 6 + fullWidth + 12, barY - 6);

    _context.lineTo(barX - 6 + fullWidth + 12, barY - 6 + 76);

    _context.lineTo(barX - 6, barY - 6 + 76);

    _context.lineTo(barX - 6, barY - 6);

    _context.closePath();

    _context.lineWidth = 4;
    _context.strokeStyle = "rgb(130,240,170)";

    _context.stroke();

    _context.fillStyle = "rgb(130,240,170)";

    _context.fillRect(barX, barY, barWidth, 64);

    var flickerChance = 0.02; // flicker

    if (Math.random() > 1 - flickerChance) {
      _context.globalAlpha = Math.random() * 0.35;
      _context.fillStyle = "rgb(255,255,255)";

      _context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }

    _context.globalAlpha = 0.07; // scanlines, consider replacing with hardcoded image

    _context.fillStyle = "rgb(255,255,255)";
    var lines = 0;

    while (lines < SCREEN_HEIGHT) {
      _context.fillRect(0, lines, SCREEN_WIDTH, 4);

      lines += 8;
    }

    _context.globalAlpha = 1;
  }

}

;
"use strict";

class MainLoadState extends GameState {
  constructor() {
    super();
    MainLoadState.prototype.loadPercentage = 0;
    this.backgroundImage = document.getElementById("MainLoadState_bg");
    console.log("MainLoadState: loading remotely");
    main_loadJsonPayload("jsfdata/main.jsf").then(res => {
      console.log("MainLoadState: download complete - parsing loadData");
      asset_parseLoadData(res);
      main_menu();
    }).catch(main_payloadError);
  }

  render() {
    _context.globalAlpha = 1;
    var fullWidth = SCREEN_WIDTH / 2 | 0;
    var barWidth = fullWidth * this.loadPercentage;
    var barX = fullWidth - fullWidth / 2 | 0;
    var barY = SCREEN_HEIGHT - 128;

    _context.drawImage(this.backgroundImage, 0, 0, 1024, 768, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    _context.beginPath();

    _context.moveTo(barX - 6, barY - 6);

    _context.lineTo(barX - 6 + fullWidth + 12, barY - 6);

    _context.lineTo(barX - 6 + fullWidth + 12, barY - 6 + 76);

    _context.lineTo(barX - 6, barY - 6 + 76);

    _context.lineTo(barX - 6, barY - 6);

    _context.closePath();

    _context.lineWidth = 4;
    _context.strokeStyle = "#afb1a7";

    _context.stroke();

    _context.fillStyle = "#afb1a7";

    _context.fillRect(barX, barY, barWidth, 64);

    _context.globalAlpha = 1;
  }

}

;
"use strict";

class MainMenuState extends GameState {
  constructor() {
    super();
    this.backgroundImage = document.getElementById('MainMenuState_bg');
    this.buttonImage = document.getElementById('MainMenuState_btn'); //@TODO: FIX

    this.menu = new Interface('jsfdata/interface/mainMenu.json');
  }

  input(e) {
    switch (e.type) {
      case "mousedown":
        break;

      case "mouseup":
        this.menu.update();
        main_gameStateFunction(this.menu.clickHandler());
        break;

      case "click":
        break;

      default:
        return;
    }

    ;
  }

  update() {
    this.menu.update();
  }

  render() {
    _context.drawImage(this.backgroundImage, 0, 0, 1024, 768, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT); // bg


    this.menu.elements.forEach((element, index) => {
      _context.drawImage(this.buttonImage, this.menu.x + element.x, this.menu.y + element.y);

      blitFRM(this.menu.mouseState == 1 && this.menu.activeItem == index ? _assets["art/intrface/menudown.frm"] : _assets["art/intrface/menuup.frm"], _context, this.menu.x + element.x + 14, this.menu.y + element.y + 4);
      blitFontString(_assets["font4.aaf"], _context, element.text, this.menu.x + element.x + element.textX, this.menu.y + element.y + element.textY, this.menu.mouseState == 1 && this.menu.activeItem == index ? "#a99028" : "#b89c28");
    });
    blitFRM(_assets["art/intrface/stdarrow.frm"], // cursor
    _context, _mouse.x, _mouse.y);
  }

}

;
"use strict";

class MapScreenState extends GameState {
  constructor() {
    super();
    this.x = (SCREEN_WIDTH / 2 | 0) - 260;
    this.y = 0;
    this.activeItem = -1;
    this.mouseState = 0;
    this.x = 0;
    this.y = 0;
    this.mapX = 40;
    this.mapY = 40;
    this.mapWidth = 400;
    this.mapHeight = 400;
    this.switchState = "low";
    this.closeButton = {
      x: 277,
      y: 454,
      width: 15,
      height: 16
    };
    this.hiSwitch = {
      x: 467,
      y: 322,
      width: 32,
      height: 60
    };
  }

  input(e) {
    switch (e.type) {
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
        switch (this.activeItem) {
          case "closeButton":
            main_gameStateFunction('closeMap');
            this.activeItem = -1; // reset this so that it mouse event doesn't propagate through on reopen

            break;

          case "hiSwitch":
            if (this.switchState == "low") this.switchState = "high";else if (this.switchState == "high") this.switchState = "low";
            this.activeItem = -1; // reset this so that it mouse event doesn't propagate through on reopen

            break;
        }

        break;

      case 'contextmenu':
        // switch input modes on mouse2
        break;
    }

    ;
  }

  update() {
    this.activeItem = -1;

    if (intersectTest(_mouse.x, _mouse.y, 0, 0, this.x + this.closeButton.x, this.y + this.closeButton.y, this.closeButton.width, this.closeButton.height)) {
      this.activeItem = "closeButton";
    } else if (intersectTest(_mouse.x, _mouse.y, 0, 0, this.x + this.hiSwitch.x, this.y + this.hiSwitch.y, this.hiSwitch.width, this.hiSwitch.height)) {
      this.activeItem = "hiSwitch";
    }
  }

  render() {
    _context.globalAlpha = 1;

    _context.drawImage(_assets["art/intrface/automap.frm"].frameInfo[0][0].img, this.x, this.y); // bg


    if (this.activeItem == "closeButton" && this.mouseState == 1) _context.drawImage(_assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img, this.x + this.closeButton.x, this.y + this.closeButton.y);
    if (this.switchState == "high") _context.drawImage(_assets["art/intrface/autoup.frm"].frameInfo[0][0].img, this.x + 457, this.y + 339);

    for (var i = 0; i < mainState.mapObjects[mainState.player.currentElevation].length; i++) {
      var h = mainState.mapObjects[mainState.player.currentElevation][i].hexPosition;
      var cx = h % 200;
      var cy = h / 200 | 0;
      var type = mainState.getObjectType(mainState.mapObjects[mainState.player.currentElevation][i].objectTypeID);

      if (this.switchState == "high") {
        if (type == "scenery") {
          _context.fillStyle = "#006c00";

          _context.fillRect(this.mapX + (this.mapWidth - cx * 2), this.mapY + cy * 2, 2, 1);
        }
      }

      if (type == "walls") {
        _context.fillStyle = "#00FF00";

        _context.fillRect(this.mapX + (this.mapWidth - cx * 2), this.mapY + cy * 2, 2, 1);
      }

      if (mainState.mapObjects[mainState.player.currentElevation][i] == mainState.player) {
        _context.fillStyle = "#FF0000";

        _context.fillRect(this.mapX + (this.mapWidth - cx * 2) - 1, this.mapY + cy * 2, 3, 1);

        _context.fillRect(this.mapX + (this.mapWidth - cx * 2), this.mapY + cy * 2 - 1, 1, 3);
      }
    }

    _context.drawImage(_assets["art/intrface/stdarrow.frm"].frameInfo[0][0].img, _mouse.x, _mouse.y); // cursor

  }

}

;
"use strict";

class PipboyState extends GameState {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.activeScreen = "status";
    this.mapX = 280;
    this.mapY = 80;
    this.interface = new Interface('jsfdata/interface/pipBoyInterface.json');
  }

  input(e) {
    switch (e.type) {
      case "mousedown":
        this.interface.mouseState = 1;
        break;

      case "mouseup":
        switch (this.interface.clickHandler()) {
          case "status":
            this.activeScreen = "status";
            break;

          case "archive":
            this.activeScreen = "archive";
            break;

          case "map":
            this.activeScreen = "map";
            break;

          case "close":
            main_gameStateFunction('closePipBoy');
            break;
        }

        this.interface.mouseState = 0;
        break;

      case "click":
        //@TODO: figure out click/mouseup
        break;

      default:
        return;
    }

    ;
  }

  update() {
    this.interface.update();
  }

  render() {
    _context.globalAlpha = 1;
    blitFRM(_assets["art/intrface/pip.frm"], _context, this.x, this.y);

    if (this.interface.mouseState == 1 && this.interface.activeItem != -1) {
      blitFRM(_assets["art/intrface/lilreddn.frm"], _context, this.interface.x + this.interface.elements[this.interface.activeItem].x, this.interface.y + this.interface.elements[this.interface.activeItem].y);
    }

    switch (this.activeScreen) {
      case "map":
        break;

      case "status":
        break;

      case "archive":
        break;
    }

    blitFRM(_assets["art/intrface/stdarrow.frm"], // cursor
    _context, _mouse.x, _mouse.y);
  }

}

;
"use strict";

class SkilldexState extends GameState {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.activeItem = -1;
    this.mouseState = -1;
    this.closeButton = {
      x: 48,
      y: 338,
      width: 15,
      height: 16
    };
    this.menuItems = [// @TODO: replace with strings from skilldex.msg
    {
      text: "SNEAK",
      action: 0,
      x: 14,
      y: 44,
      width: 86,
      height: 33,
      textX: 18,
      textY: 6
    }, {
      text: "LOCKPICK",
      action: 0,
      x: 14,
      y: 80,
      width: 86,
      height: 33,
      textX: 6,
      textY: 6
    }, {
      text: "STEAL",
      action: 0,
      x: 14,
      y: 116,
      width: 86,
      height: 33,
      textX: 20,
      textY: 6
    }, {
      text: "TRAPS",
      action: 0,
      x: 14,
      y: 152,
      width: 86,
      height: 33,
      textX: 17,
      textY: 6
    }, {
      text: "FIRST AID",
      action: 0,
      x: 14,
      y: 188,
      width: 86,
      height: 33,
      textX: 5,
      textY: 6
    }, {
      text: "DOCTOR",
      action: 0,
      x: 14,
      y: 224,
      width: 86,
      height: 33,
      textX: 11,
      textY: 6
    }, {
      text: "SCIENCE",
      action: 0,
      x: 14,
      y: 260,
      width: 86,
      height: 33,
      textX: 13,
      textY: 6
    }, {
      text: "REPAIR",
      action: 0,
      x: 14,
      y: 296,
      width: 86,
      height: 33,
      textX: 13,
      textY: 6
    }];
  }

  action(action) {
    main_gameStateFunction('closeSkilldex');

    switch (action) {
      case 0:
        //sneak
        break;
    }
  }

  input(e) {
    switch (e.type) {
      case "mousemove":
        break;

      case "keydown":
        if (_keyboard['Escape']) {
          main_gameStateFunction('closeSkilldex');
          return;
        }

        break;

      case "mousedown":
        this.mouseState = 1;
        break;

      case "mouseup":
        this.mouseState = 0;
        break;

      case "click":
        switch (this.activeItem) {
          case -1:
            break;

          case 0:
            this.action("sneak");
            break;

          case 1:
            this.action("lockpick");
            break;

          case "closeButton":
            main_gameStateFunction('closeSkilldex');
            this.activeItem = -1; // reset this so that it mouse event doesn't propagate through on reopen

            break;
        }

        break;

      case 'contextmenu':
        // switch input modes on mouse2
        break;
    }

    ;
  }

  update() {
    this.activeItem = -1;

    if (intersectTest(_mouse.x, _mouse.y, 0, 0, this.x + this.closeButton.x, this.y + this.closeButton.y, this.closeButton.width, this.closeButton.height)) {
      this.activeItem = "closeButton";
      return;
    }

    for (var i = 0; i < this.menuItems.length; i++) {
      if (intersectTest(_mouse.x, _mouse.y, 0, 0, this.x + this.menuItems[i].x, this.y + this.menuItems[i].y, this.menuItems[i].width, this.menuItems[i].height)) {
        this.activeItem = i;
        return;
      }
    }
  }

  render() {
    _context.drawImage(_assets["art/intrface/skldxbox.frm"].frameInfo[0][0].img, this.x, this.y); // interface


    blitFontString(_assets["font3.aaf"], "SKILLDEX", this.x + 55, this.y + 14, "#907824");
    blitFontString(_assets["font3.aaf"], "CANCEL", this.x + 72, this.y + 337, this.mouseState == 1 && this.activeItem == "closeButton" ? "#806814" : "#907824");

    _context.drawImage(this.mouseState == 1 && this.activeItem == "closeButton" ? _assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img : _assets["art/intrface/lilredup.frm"].frameInfo[0][0].img, this.x + this.closeButton.x, this.y + this.closeButton.y);

    for (var i = 0; i < this.menuItems.length; i++) {
      _context.drawImage(this.mouseState == 1 && this.activeItem == i ? _assets["art/intrface/skldxon.frm"].frameInfo[0][0].img : _assets["art/intrface/skldxoff.frm"].frameInfo[0][0].img, this.x + this.menuItems[i].x, this.y + this.menuItems[i].y);

      blitFontString(_assets["font3.aaf"], this.menuItems[i].text, this.x + this.menuItems[i].x + this.menuItems[i].textX, this.y + this.menuItems[i].y + this.menuItems[i].textY, this.mouseState == 1 && this.activeItem == i ? "#806814" : "#907824");
    }

    _context.drawImage(_assets["art/intrface/stdarrow.frm"].frameInfo[0][0].img, _mouse.x, _mouse.y);
  }

}

;
"use strict";

window.addEventListener("load", main_init);

function main_init() {
  // Test for browser compatibility.
  if (!browser_test()) {
    throw new Error("Browser failed compatibility test");
  }

  _canvas = document.getElementById('mainCanvas');
  _canvas.style.cursor = "none";
  document.getElementById("main").style.width = SCREEN_WIDTH;
  _canvas.width = SCREEN_WIDTH;
  _canvas.height = SCREEN_HEIGHT;
  _context = _canvas.getContext("2d");
  _context.imageSmoothingEnabled = false;
  document.addEventListener('mousemove', main_input); // add input listeners

  _canvas.addEventListener('mousedown', main_input);

  _canvas.addEventListener('mouseup', main_input);

  _canvas.addEventListener('click', main_input);

  _canvas.addEventListener('contextmenu', main_input);

  document.addEventListener('keydown', main_input); // declare at document scope

  document.addEventListener('keyup', main_input);

  var main_loop = function () {
    main_update();
    main_render();
    window.requestAnimationFrame(main_loop);
  };

  mainState = new MainState();
  loadState = new LoadState();
  mainLoadState = new MainLoadState();
  mainMenuState = new MainMenuState();
  ingameMenuState = new IngameMenuState(); // init in mainState

  skilldexState = new SkilldexState();
  contextMenuState = new ContextMenuState();
  inventoryState = new InventoryState();
  characterScreenState = new CharacterScreenState();
  pipboyState = new PipboyState();
  mapScreenState = new MapScreenState();
  window.requestAnimationFrame(main_loop); // init loop

  _canvas.focus();

  activeGameStates.push(mainLoadState);
  mainLoadState.init();
  mainState.console.print("Welcome to jsFO!");
}

;

function main_menu() {
  main_gameStateFunction('closeIngameMenu');
  let mainLoadState_index = activeGameStates.indexOf(mainLoadState);

  if (mainLoadState_index > -1) {
    //	remove mainState
    activeGameStates.splice(mainLoadState_index, 1);
  }

  let loadState_index = activeGameStates.indexOf(loadState);

  if (loadState_index > -1) {
    //	remove mainState
    activeGameStates.splice(loadState_index, 1);
  }

  let mainState_index = activeGameStates.indexOf(mainState);

  if (mainState_index > -1) {
    //	remove mainState
    activeGameStates.splice(mainState_index, 1);
  }

  activeGameStates.push(mainMenuState);
}

;

function main_input(e) {
  e.preventDefault();

  switch (e.type) {
    case "mousemove":
      clientBoundingRect = _canvas.getBoundingClientRect();
      _mouse.x = e.clientX - clientBoundingRect.left | 0;
      _mouse.y = e.clientY - clientBoundingRect.top | 0;
      break;

    case "mousedown":
      _mouse[e.button] = true;
      break;

    case "mouseup":
      _mouse[e.button] = false;
      break;

    case "keydown":
      _keyboard[e.code] = true;
      break;

    case "keyup":
      _keyboard[e.code] = false;
      break;

    case "click":
      break;
  }

  ;

  for (let i = 0; i < activeGameStates.length; i++) {
    if (!activeGameStates[i].statePause) activeGameStates[i].input.call(activeGameStates[i], e);
  }

  return false;
}

;

function main_update() {
  fps_currentTime = Date.now();

  for (let i = 0; i < activeGameStates.length; i++) {
    if (!activeGameStates[i].statePause) activeGameStates[i].update.call(activeGameStates[i]);
  }
}

;

function main_render() {
  _canvas.width = SCREEN_WIDTH; // hack clear

  for (let i = 0; i < activeGameStates.length; i++) {
    activeGameStates[i].render.call(activeGameStates[i]);
  }
}

;

function main_loadGame(_saveState) {
  main_gameStateFunction('closeIngameMenu');
  let mainMenuState_index = activeGameStates.indexOf(mainMenuState);

  if (mainMenuState_index > -1) {
    //	remove mainState
    activeGameStates.splice(mainMenuState_index, 1);
  }

  let mainState_index = activeGameStates.indexOf(mainState);

  if (mainState_index > -1) {
    //	remove mainState
    activeGameStates.splice(mainState_index, 1);
  }

  let loadState_index = activeGameStates.indexOf(loadState);

  if (loadState_index > -1) {
    //	remove mainState
    activeGameStates.splice(loadState_index, 1);
  }

  activeGameStates.push(loadState);
  loadState.init(_saveState);
}

;

function main_openActiveState(state) {
  mainState.statePause = true;
  activeGameStates.push(state);
  _keyboard['Escape'] = false; // LOL - sets ESC key state to false to prevent the next iteration of the gamestate stack from capturing the input.
}

;

function main_closeActiveState(state) {
  if (mainState.statePause) mainState.statePause = false;
  let statePosition = activeGameStates.indexOf(state);

  if (statePosition) {
    activeGameStates.splice(activeGameStates.indexOf(state), 1);
  } else {
    console.log("main_closeActiveState: Invalid state");
  }
}

;

function main_gameStateFunction(f, options) {
  switch (f) {
    case "main_initGameState":
      mainState.loadSaveState(options.saveState);
      activeGameStates.splice(activeGameStates.indexOf(loadState), 1);
      activeGameStates.push(mainState);
      break;

    case "main_loadGameState":
      break;

    case "mainMenu_newGame":
      main_loadGame(newGame);
      break;

    case "openContextMenu":
      contextMenuState.setMenuItems(options.obj, options.x, options.y);
      main_openActiveState(contextMenuState);
      break;

    case "closeContextMenu":
      main_closeActiveState(contextMenuState);
      break;

    case "openInventory":
      main_openActiveState(inventoryState);
      break;

    case "closeInventory":
      main_closeActiveState(inventoryState);
      break;

    case "openIngameMenu":
      main_openActiveState(ingameMenuState);
      break;

    case "closeIngameMenu":
      main_closeActiveState(ingameMenuState);
      break;

    case "openSkilldex":
      main_closeActiveState(skilldexState);
      break;

    case "openCharacterScreen":
      main_openActiveState(characterScreenState);
      break;

    case "closeCharacterScreen":
      main_closeActiveState(characterScreenState);
      break;

    case "openPipBoy":
      main_openActiveState(pipboyState);
      break;

    case "closePipBoy":
      main_closeActiveState(pipboyState);
      break;

    case "openMap":
      main_openActiveState(mapScreenState);
      break;

    case "closeMap":
      main_closeActiveState(mapScreenState);
      break;

    default:
      console.log('main_gameStateFunction: improper arguments supplied');
      break;
  }
}

;

function main_payloadError(error) {
  console.log(error);
}

;

function main_loadJsonPayload(url) {
  return new Promise((resolve, reject) => {
    let payloadXHR = new XMLHttpRequest();

    payloadXHR.onload = function () {
      resolve(this.response);
    };

    payloadXHR.onerror = function () {
      reject(this.statusText);
    };

    payloadXHR.open("GET", url, true);
    payloadXHR.responseType = 'json';
    payloadXHR.send();
  });
}

;
