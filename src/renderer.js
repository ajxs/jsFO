"use strict";

let blitFRM_image = null;
function blitFRM(frm, dest, dx, dy, dir = 0, frame = 0, alpha = 1, outlineColor = null, outlineAlpha = 1) {
	if(!frm) return;
	if(alpha < 1) dest.globalAlpha = alpha;
	dest.drawImage(frm.img,
		frm.frameInfo[dir][frame].atlasX,
	 	frm.frameInfo[dir][frame].atlasY,
		frm.frameInfo[dir][frame].width,
		frm.frameInfo[dir][frame].height,
		dx,
		dy,
		frm.frameInfo[dir][frame].width,
		frm.frameInfo[dir][frame].height);
	if(alpha < 1) dest.globalAlpha = 1;

	if(outlineColor) {
		if(outlineAlpha < 1) dest.globalAlpha = outlineAlpha;
		if(!frm['img_outline_' + outlineColor]) createFRMOutline(frm, outlineColor);
		dest.drawImage(frm['img_outline_' + outlineColor],
			frm.frameInfo_outline[dir][frame].atlasX,
		 	frm.frameInfo_outline[dir][frame].atlasY,
			frm.frameInfo_outline[dir][frame].width,
			frm.frameInfo_outline[dir][frame].height,
			dx - 1,		// offset for outline
			dy - 1,
			frm.frameInfo_outline[dir][frame].width,
			frm.frameInfo_outline[dir][frame].height);
		if(outlineAlpha < 1) dest.globalAlpha = 1;
	}


};

const createFRMOutline_shadowColor = 12;
function createFRMOutline(frm, color = "#FF0000") {
	console.log("creating " + color + " outline FRM img for: " + frm);
	var outlines = new Array(frm.frameInfo.length);
	var maxHeight = 0, maxWidth = 0;

	for(let dir = 0; dir < frm.frameInfo.length; dir++) {
		outlines[dir] = new Array(frm.nFrames);

		for(let f = 0; f < frm.nFrames; f++) {
			let outlineCanvas = document.createElement('canvas');
			outlineCanvas.width = frm.frameInfo[dir][f].width + 2;
			outlineCanvas.height = frm.frameInfo[dir][f].height + 2;
			let outlineContext = outlineCanvas.getContext('2d');
			outlineContext.imageSmoothingEnabled = false;

			let trimmedCanvas = document.createElement('canvas');		// Trim off shadow then reblit
			trimmedCanvas.width = frm.frameInfo[dir][f].width + 2;
			trimmedCanvas.height = frm.frameInfo[dir][f].height + 2;
			let trimmedContext = trimmedCanvas.getContext('2d');
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

			let trimmedData = trimmedContext.getImageData(0,0,
				frm.frameInfo[dir][f].width + 2,
				frm.frameInfo[dir][f].height + 2);

			let x, y;
			outlineContext.fillStyle = color;
			for(let i = 0, imgDataLength = trimmedData.data.length; i < imgDataLength; i+=4) {
				if(trimmedData.data[i+3] > 0) {
					x = (i/4) % (frm.frameInfo[dir][f].width + 2);
					y = ((i/4) / (frm.frameInfo[dir][f].width + 2))|0;
					outlineContext.fillRect(x-1, y-1, 3, 3);
				}
			}

			let imgData = outlineContext.getImageData(0,0,
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
};


let rF_stringlength = 0;
let rF_symbolIndex = 0;
let rF_totalWidth = 0;
let rF_baseline = 0;
let rF_img = 0;


function createFontOutlineImg(_font, _outlineColor) {

	let maxHeight = 0, maxWidth = 0, currentX = 0;
	let symbolInfo_outline = _font.symbolInfo.map(function(symbol) {
		if(symbol.width == 0 || symbol.height == 0) {
			return {
				width: 0,
				height: 0
			};
		}

		if((symbol.height+2) > maxHeight) maxHeight = (symbol.height+2);
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
	outlineCanvas.width = maxWidth;
	outlineCanvas.height = maxHeight;
	let outlineContext = outlineCanvas.getContext('2d');

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


	let imgData = outlineContext.getImageData(0,0,
		outlineCanvas.width,
		outlineCanvas.height);

	outlineContext.fillStyle = _outlineColor;
	let x,y;
	for(let i = 0, imgDataLength = imgData.data.length; i < imgDataLength; i+=4) {
		if(imgData.data[i+3] > 0) {
			x = (i/4) % outlineCanvas.width;
			y = ((i/4) / outlineCanvas.width)|0;
			outlineContext.fillRect(x-1, y-1, 3, 3);
		}
	}

	_font.symbolInfo_outline = symbolInfo_outline;
	_font["img_outline_" + _outlineColor] = outlineCanvas;

};

function blitFontString(_font, _dest, _string, _x, _y, _color = null, _outlineColor = null) {

	if(_font.img.width == 0 || _font.img.height == 0) return;		// hack fix for firefox race condition bug.

	rF_stringlength = _string.length;
	rF_totalWidth = 0;
	rF_baseline = _y + _font.height;

	if(_color) {
		if(!_font.hasOwnProperty("img_" + _color)) {
			console.log("Bitmap Font: call to font render for surface without color: ", _color);
			createFontColorImg(_font, _color);	// if no colorized img, create one.
		}
		rF_img = _font["img_" + _color];
	} else rF_img = _font.img;

	if(_outlineColor) {
		if(!_font.hasOwnProperty("img_outline_" + _outlineColor)) {
			console.log("Bitmap Font: call to font render for surface without outline color: ", _outlineColor);
			createFontOutlineImg(_font, _outlineColor);	// if no colorized img, create one.
		}
	}

	for(var i = 0; i < rF_stringlength; i++) {
		rF_symbolIndex = _string.charCodeAt(i);
		if(rF_symbolIndex == 32) {	// space
			rF_totalWidth += _font.symbolInfo[32].width;
		} else {
			if(!_font.symbolInfo[rF_symbolIndex].width) continue;

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
};


function createFontColorImg(_font, _color) {	// creates canvas element with coloured font
	//@TODO - "create check so that you can't create duplicate rgb(r,g,b) and #rgb versions by accident. - Potentially force hex colors as argument.

	console.log("Font: Creating color surface: " + _color);

	if(_font["img_" + _color]) return;

	_font["img_" + _color] = document.createElement("canvas");
	_font["img_" + _color].width = _font.img.width;
	_font["img_" + _color].height = _font.img.height;

	var _fontContext = _font["img_" + _color].getContext("2d");

	if(_font.type == "fon") {
		_fontContext.globalCompositeOperation = "source-over";
		_fontContext.fillStyle = _color;
		_fontContext.fillRect(0,0,_font["img_" + _color].width,_font["img_" + _color].height);

		_fontContext.globalCompositeOperation = "destination-in";
		_fontContext.drawImage(_font.img,0,0);

	} else {
		_fontContext.globalCompositeOperation = "source-over";
		_fontContext.drawImage(_font.img,0,0);

		var imgData1 = _fontContext.getImageData(0,0,_font.img.width,_font.img.height);

		_fontContext.globalCompositeOperation = "source-in";
		_fontContext.fillStyle = _color;
		_fontContext.fillRect(0,0,_font["img_" + _color].width,_font["img_" + _color].height);
		var imgData2 = _fontContext.getImageData(0,0,_font.img.width,_font.img.height);

		for(var i=0; i < imgData2.data.length; i+=4) {	// AAF 0-9 values act as alpha blend
			imgData2.data[i+3] = imgData1.data[i];
		}

		_fontContext.putImageData(imgData2,0,0);
	}

};
