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
function intersectTest(ax,
	ay,
	aw,
	ah,
	bx,
	by,
	bw,
	bh)
{
	return !(bx > (ax + aw) ||
		(bx + bw) < ax ||
		by > (ay + ah) ||
		(by + bh) < ay);
}


/**
 * Draws a hex outline on screen.
 * @param {number} _x - The x coordinate to draw the hex at.
 * @param {number} _y - The y coordinate to draw the hex at.
 * @param {string} [_text] - Optional text to draw within the hex.
 * @param {string} [_col] - The colour for the hex outline.
 */
function drawHex(_x,
	_y,
	_text = null,
	_col = "#00FF00")
{
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

	if(_text) {
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
function drawTile(_x,
	_y,
	_text = null,
	_col =  "#00FF00")
{
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

	if(_text) {
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
function convertHexIndexToScreenCoords(i)
{
	const q = (i % map_hex_width) | 0;
	const r = (i / map_hex_width) | 0;
	const px = 0 - q * 32 + r * 16;
	const py = r * 12;
	const qx = ((q / 2) | 0) * 16;
	const qy = ((q / 2) | 0) * 12;

	return {
		x: px + qx,
		y: py + qy,
	}
}


/**
 * Converts a map tile index to the onscreen coordinates representing its position
 * in the world map.
 * @param {number} i - The index to convert.
 * @returns An object containing the x,y coordinates representing this tile index.
 */
function convertTileIndexToScreenCoords(i)
{
	const tCol = i % map_tile_width;
	const tRow = (i / map_tile_width) | 0;
	return {
		x: 0 - map_alignment_offset.x - (tCol * 48) + (tRow * 32),    // map origin { x: 0, y: 0} is at upper right.
		y: map_alignment_offset.y + tCol * 12 + (tRow * 24),
	}
}


/**
 * Finds the hex index that a particular x,y coordinate point will fall within.
 * @param {number} mx - The x coordinate to check.
 * @param {number} my - The y coordinate to check.
 * @returns The hex index representing what hex these coordinates fall within.
 */
function convertScreenCoordsToHexIndex(mx,
	my)
{
	// compensate for -0 effect
	if (mx < 0) {
		mx -= 32;
	}

	mx *= -1;

	let hCol = (mx / 32) | 0;
	let hRow = (my / 12) | 0;
	if (hRow > 0) {
		hCol += Math.abs(hRow / 2) | 0;
	}

	hRow -= (hCol / 2) | 0;

	return (hRow * map_hex_width) + hCol;
}


/**
 * Finds all the adjacent hexes to a provided hex index.
 * @param {number} i - The hex index to check.
 * @returns An array of indexes of hexes adjacent to the provided hex index.
 */
function findAdjacentHexes(i)
{
	return new Array(
		(i % 2) ? i - (map_hex_width + 1) : i - 1,
		(i % 2) ? i - 1 : i + (map_hex_width - 1),
		i + map_hex_width,
		(i % 2) ? i + 1 : i + (map_hex_width + 1),
		(i % 2) ? i - (map_hex_width - 1) : i + 1,
		i - map_hex_width);
}

/**
 * Finds the orientation between two adjacent hexes.
 * @param {number} _origin - The origin hex.
 * @param {number} _dest - The destination hex.
 * @returns The orientation.
 */
function findOrientation(_origin,
	_dest)
{
	if(_origin == _dest) {
		console.log("MainState: findOrientation error: origin and dest identical");
		return 0;
	}

	const orientation = findAdjacentHexes(_origin).indexOf(_dest);

	if(orientation == -1) {
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
function hDistance(_a,
	_b)
{
	// pythagorean distance.
	const ha = convertHexIndexToScreenCoords(_a);
	const hb = convertHexIndexToScreenCoords(_b);

	const dx = Math.abs(hb.x - ha.x);
	const dy = Math.abs(hb.y - ha.y);

	return Math.sqrt((dx * dx) + (dy * dy));
}
