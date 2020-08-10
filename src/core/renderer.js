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
function blitFRM(frm,
	dest,
	dx,
	dy,
	dir = 0,
	frame = 0,
	alpha = 1)
{
	if(!frm) {
		throw new Error("No FRM provided");
	}

	// Set destination buffer alpha.
	dest.globalAlpha = alpha;

	dest.drawImage(frm.img,
		frm.frameInfo[dir][frame].atlasX,
	 	frm.frameInfo[dir][frame].atlasY,
		frm.frameInfo[dir][frame].width,
		frm.frameInfo[dir][frame].height,
		dx,
		dy,
		frm.frameInfo[dir][frame].width,
		frm.frameInfo[dir][frame].height);

	// Reset destination buffer alpha.
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
function blitFRMOutline(frm,
	dest,
	dx,
	dy,
	dir = 0,
	frame = 0,
	outlineColor = null,
	outlineAlpha = 1)
{
	if(!frm) {
		throw new Error("No FRM provided");
	}

	/** The string used to reference the FRM outline. */
	const frmString = `img_outline_${outlineColor}`;

	// Set the destination buffer alpha.
	dest.globalAlpha = outlineAlpha;

	// If the outline does not exist, create it.
	if(!frm[frmString]) {
		createFRMOutline(frm, outlineColor);
	}

	dest.drawImage(frmString,
		frm.frameInfo_outline[dir][frame].atlasX,
		frm.frameInfo_outline[dir][frame].atlasY,
		frm.frameInfo_outline[dir][frame].width,
		frm.frameInfo_outline[dir][frame].height,
		dx - 1,    // Outline is offset by 1 pixel.
		dy - 1,
		frm.frameInfo_outline[dir][frame].width,
		frm.frameInfo_outline[dir][frame].height);

	// Reset destination buffer alpha.
	dest.globalAlpha = 1;
}


const createFRMOutline_shadowColor = 12;

/**
 * Creates an FRM outline asset for a specified FRM.
 * @param {*} frm - The FRM to create the outline for.
 * @param {*} color - The color for the outline.
 */
function createFRMOutline(frm, color = "#FF0000")
{
	console.log("creating " + color + " outline FRM img for: " + frm);
	let outlines = new Array(frm.frameInfo.length);
	let maxHeight = 0;
	let maxWidth = 0;

	for(let dir = 0; dir < frm.frameInfo.length; dir++) {
		outlines[dir] = new Array(frm.nFrames);

		for(let f = 0; f < frm.nFrames; f++) {
			const outlineCanvas = document.createElement('canvas');
			outlineCanvas.width = frm.frameInfo[dir][f].width + 2;
			outlineCanvas.height = frm.frameInfo[dir][f].height + 2;

			const outlineContext = outlineCanvas.getContext('2d');
			outlineContext.imageSmoothingEnabled = false;

			const trimmedCanvas = document.createElement('canvas');		// Trim off shadow then reblit
			trimmedCanvas.width = frm.frameInfo[dir][f].width + 2;
			trimmedCanvas.height = frm.frameInfo[dir][f].height + 2;

			const trimmedContext = trimmedCanvas.getContext('2d');
			trimmedCanvas.imageSmoothingEnabled = false;
			trimmedContext.globalCompositeOperation = 'source-over';

			trimmedContext.drawImage(frm.img,
				frm.frameInfo[dir][f].atlasX,
			 	frm.frameInfo[dir][f].atlasY,
				frm.frameInfo[dir][f].width,
				frm.frameInfo[dir][f].height,
				1,
				1,
				frm.frameInfo[dir][f].width,
				frm.frameInfo[dir][f].height);

				const trimmedData = trimmedContext.getImageData(0,0,
				frm.frameInfo[dir][f].width + 2,
				frm.frameInfo[dir][f].height + 2);

			let x = null;
			let y = null;

			outlineContext.fillStyle = color;
			for(let i = 0, imgDataLength = trimmedData.data.length; i < imgDataLength; i+=4) {
				if(trimmedData.data[i+3] > 0) {
					x = (i/4) % (frm.frameInfo[dir][f].width + 2);
					y = ((i/4) / (frm.frameInfo[dir][f].width + 2))|0;
					outlineContext.fillRect(x-1, y-1, 3, 3);
				}
			}

			const imgData = outlineContext.getImageData(0,0,
				frm.frameInfo[dir][f].width + 2,
				frm.frameInfo[dir][f].height + 2);

			for(let i = 0, imgDataLength = trimmedData.data.length; i < imgDataLength; i+=4) {
				if(trimmedData.data[i+3] > 0) imgData.data[i+3] = 0;
			}

			outlineContext.putImageData(imgData,0,0);

			maxWidth += frm.frameInfo[dir][f].width + 2;
			if(frm.frameInfo[dir][f].height + 2 > maxHeight) maxHeight = frm.frameInfo[dir][f].height + 2
			outlines[dir][f] = outlineCanvas;

		}
	}

	let total = document.createElement('canvas');
	let totalContext = total.getContext('2d');
	total.width = maxWidth;
	total.height = maxHeight;

	let currentX = 0;
	let outlineInfo = new Array(frm.frameInfo.length);
	for(let dir = 0; dir < frm.frameInfo.length; dir++) {
		outlineInfo[dir] = new Array(frm.nFrames);
		for(let f = 0; f < frm.nFrames; f++) {
			totalContext.drawImage(outlines[dir][f], currentX, 0);

			outlineInfo[dir][f] = {
				atlasX: currentX,
				atlasY: 0,
				width: frm.frameInfo[dir][f].width + 2,
				height: frm.frameInfo[dir][f].height + 2,
				offsetX: frm.frameInfo[dir][f].offsetX,
				offsetY: frm.frameInfo[dir][f].offsetY
			}

			currentX += frm.frameInfo[dir][f].width + 2;
		}
	}
	frm['img_outline_' + color] = total;
	frm.frameInfo_outline = outlineInfo;
}


function createFontOutlineImg(_font,
	_outlineColor)
{
	let maxHeight = 0;
	let maxWidth = 0;
	let currentX = 0;
	let symbolInfo_outline = _font.symbolInfo.map(function(symbol) {
		if(symbol.width == 0 || symbol.height == 0) {
			return {
				width: 0,
				height: 0
			};
		}

		if((symbol.height + 2) > maxHeight) {
			maxHeight = symbol.height + 2;
		}

		currentX = maxWidth;
		maxWidth += symbol.width + 2;

		return {
			x: currentX,
			y: 0,
			width: symbol.width + 2,
			height: symbol.height + 2,
		};
	});

	let outlineCanvas = document.createElement('canvas');
	let outlineContext = outlineCanvas.getContext('2d');
	outlineCanvas.width = maxWidth;
	outlineCanvas.height = maxHeight;

	for(let i = 0; i < symbolInfo_outline.length; i++) {
		outlineContext.drawImage(_font.img,
		_font.symbolInfo[i].x,
		_font.symbolInfo[i].y,
		_font.symbolInfo[i].width,
		_font.symbolInfo[i].height,
		symbolInfo_outline[i].x + 1,
		symbolInfo_outline[i].y + 1,
		_font.symbolInfo[i].width,
		_font.symbolInfo[i].height);
	}

	const imgData = outlineContext.getImageData(0,0,
		outlineCanvas.width,
		outlineCanvas.height);

	outlineContext.fillStyle = _outlineColor;
	let x;
	let y;
	for(let i = 0, imgDataLength = imgData.data.length; i < imgDataLength; i+=4) {
		if(imgData.data[i+3] > 0) {
			x = (i/4) % outlineCanvas.width;
			y = ((i/4) / outlineCanvas.width)|0;
			outlineContext.fillRect(x-1, y-1, 3, 3);
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
function blitFontString(_font,
	_dest,
	_string,
	_x,
	_y,
	_color = null,
	_outlineColor = null)
{
	// hack fix for firefox race condition bug.
	if(_font.img.width == 0 || _font.img.height == 0) {
		return;
	}

	/** The string used to reference the FRM. */
	const frmString = `img_${_color}`;

	let rF_stringlength = _string.length;
	let rF_symbolIndex = 0;
	let rF_totalWidth = 0;
	let rF_baseline = _y + _font.height;
	let rF_img = 0;

	if(_color) {
		// if no colorized img, create one.
		if(!_font.hasOwnProperty(frmString)) {
			console.log("Bitmap Font: call to font render for surface without color: ", _color);
			createFontColorImg(_font, _color);
		}
		rF_img = _font[frmString];
	} else rF_img = _font.img;

	if(_outlineColor) {
		// if no colorized img, create one.
		if(!_font.hasOwnProperty("img_outline_" + _outlineColor)) {
			console.log("Bitmap Font: call to font render for surface without outline color: ", _outlineColor);
			createFontOutlineImg(_font, _outlineColor);
		}
	}

	for(let i = 0; i < rF_stringlength; i++) {
		rF_symbolIndex = _string.charCodeAt(i);
		if(rF_symbolIndex == 32) {	// space
			rF_totalWidth += _font.symbolInfo[32].width;
		} else {
			if(!_font.symbolInfo[rF_symbolIndex].width) {
				continue;
			}

			if(_outlineColor) {
				_dest.drawImage(_font["img_outline_" + _outlineColor],
					_font.symbolInfo_outline[rF_symbolIndex].x, _font.symbolInfo_outline[rF_symbolIndex].y,
					_font.symbolInfo_outline[rF_symbolIndex].width, _font.symbolInfo_outline[rF_symbolIndex].height,
					_x + rF_totalWidth - 1,
					rF_baseline - _font.symbolInfo_outline[rF_symbolIndex].height + 1,
					_font.symbolInfo_outline[rF_symbolIndex].width, _font.symbolInfo_outline[rF_symbolIndex].height);
			}

			_dest.drawImage(rF_img,
				_font.symbolInfo[rF_symbolIndex].x, _font.symbolInfo[rF_symbolIndex].y,
				_font.symbolInfo[rF_symbolIndex].width, _font.symbolInfo[rF_symbolIndex].height,
				_x + rF_totalWidth, rF_baseline - _font.symbolInfo[rF_symbolIndex].height,
				_font.symbolInfo[rF_symbolIndex].width, _font.symbolInfo[rF_symbolIndex].height);

			rF_totalWidth += (_font.symbolInfo[rF_symbolIndex].width + _font.gapSize);
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
function createFontColorImg(_font,
	_color)
{
	console.log("Font: Creating color surface: " + _color);

	/** The string used to reference the FRM. */
	const frmString = `img_${_color}`;

	// If the font color image already exists, exit.
	if(_font[frmString]) {
		return;
	}

	// Create the base color image as a canvas element.
	_font[frmString] = document.createElement("canvas");
	_font[frmString].width = _font.img.width;
	_font[frmString].height = _font.img.height;

	const _fontContext = _font[frmString].getContext("2d");

	if(_font.type == "fon") {
		_fontContext.globalCompositeOperation = "source-over";
		_fontContext.fillStyle = _color;
		_fontContext.fillRect(0,0,_font[frmString].width,_font[frmString].height);

		_fontContext.globalCompositeOperation = "destination-in";
		_fontContext.drawImage(_font.img,0,0);
	} else {
		_fontContext.globalCompositeOperation = "source-over";
		_fontContext.drawImage(_font.img,0,0);

		const imgData1 = _fontContext.getImageData(0,0,_font.img.width,_font.img.height);

		_fontContext.globalCompositeOperation = "source-in";
		_fontContext.fillStyle = _color;
		_fontContext.fillRect(0,0,_font[frmString].width,_font[frmString].height);

		const imgData2 = _fontContext.getImageData(0,0,_font.img.width,_font.img.height);

		for(let i = 0; i < imgData2.data.length; i += 4) {
			// AAF 0-9 values act as alpha blend.
			imgData2.data[i+3] = imgData1.data[i];
		}

		_fontContext.putImageData(imgData2,0,0);
	}
}
