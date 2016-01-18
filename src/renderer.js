var blit_nPixels;
var blit_dx, blit_dy;
var blit_it;

function blit(source, _x, _y, sourceWidth, sourceHeight) {
	blit_nPixels = sourceWidth*sourceHeight;
	for(blit_it = 0; blit_it < blit_nPixels; blit_it++) {
		if(source[blit_it] == 0) continue;
		blit_dx = _x + (blit_it%sourceWidth);
		blit_dy = _y + ((blit_it/sourceWidth)|0);
		
		if(blit_dx < 0 || blit_dx >= _screenWidth || blit_dy < 0 || blit_dy >= _screenHeight) continue;
		_screenBuffer[blit_dx+(blit_dy*_screenWidth)] = source[blit_it];
	};
};