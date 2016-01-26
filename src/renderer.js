'use strict';

//		http://jsperf.com/jsfogl1

var blit_nPixels;
var blit_dx, blit_dy;
var blit_it;


/* 
var blit_src;
var blit_xEnd, blit_yEnd;
var blit_xStart, blit_yStart;
var blit_xLength;

var blit_row, blit_col;

function blit(_source, _x, _y, _sourceWidth, _sourceHeight) {

	if(_x + _sourceWidth > _screenWidth) blit_xEnd = (_screenWidth - _x);
	else blit_xEnd = _sourceWidth;

	if(_y + _sourceHeight > _screenHeight) blit_yEnd = (_screenHeight - _y);
	else blit_yEnd = _sourceHeight;

	blit_xStart = (_x < 0) ? (0 - _x) : 0;
	blit_yStart = (_y < 0) ? (0 - _y) : 0;

	blit_xLength = (blit_xEnd - blit_xStart);
	blit_nPixels = (blit_xEnd - blit_xStart) * (blit_yEnd - blit_yStart);

	for(blit_it = 0; blit_it < blit_nPixels; blit_it++) {
		blit_row = (blit_it/blit_xLength)|0;
		blit_col = blit_it%blit_xLength;

		blit_src = ( blit_yStart * _sourceWidth ) + blit_xStart + (blit_row * _sourceWidth) + blit_col;

		if(_source[blit_src] == 0) continue;
		blit_dx = _x + blit_xStart + blit_col;
		blit_dy = _y + blit_yStart + blit_row;

		_screenBuffer[blit_dx+(blit_dy*_screenWidth)] = _source[blit_src];
	};
}; */


function blit(source, _x, _y, sourceWidth, sourceHeight) {		// original blit function using bounds checking as opposed to "sprite clipping" method.
	blit_nPixels = sourceWidth*sourceHeight;
	for(blit_it = 0; blit_it < blit_nPixels; blit_it++) {
		if(source[blit_it] == 0) continue;
		blit_dx = _x + (blit_it%sourceWidth);
		blit_dy = _y + ((blit_it/sourceWidth)|0);

		if(blit_dx < 0 || blit_dx >= _screenWidth || blit_dy < 0 || blit_dy >= _screenHeight) continue;
		_screenBuffer[blit_dx+(blit_dy*_screenWidth)] = source[blit_it];
	};
};
