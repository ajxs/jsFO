"use strict";

var bitmapFontRenderer = {
	
	rF_stringlength: 0,
	rF_symbolIndex: 0,
	rF_totalWidth: 0,
	rF_baseline: 0,
	rF_img: 0,
	
	createColorImg(_font, _color) {	// creates canvas element with coloured font
		//@TODO - "create check so that you can't create duplicate rgb(r,g,b) and #rgb versions by accident. - Potentially force hex colors as argument.
	
		console.log("Bitmap Font: Creating color surface: " + _color);

		//console.log(_font["img_" + _color].width,_font["img_" + _color].height);
		//console.log(_font.img.width,_font.img.height);
		
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
		
	},
	
	renderString: function(_font, _string, _x, _y, _color) {
		
		if(_font.img.width == 0 || _font.img.height == 0) return;		// hack fix for firefox race condition bug.
		
		this.rF_stringlength = _string.length;
		this.rF_totalWidth = 0;
		this.rF_baseline = _y + _font.height;

		if(_color) {
			if(!_font.hasOwnProperty("img_" + _color)) {	
				console.log("Bitmap Font: call to font render for surface without color: ", _color);
				this.createColorImg(_font, _color);	// if no colorized img, create one.
			}
			this.rF_img = _font["img_" + _color];
		} else this.rF_img = _font.img;
		
		for(var i = 0; i < this.rF_stringlength; i++) {
			this.rF_symbolIndex = _string.charCodeAt(i);
			if(this.rF_symbolIndex == 32) {	// space		
				this.rF_totalWidth += _font.symbolInfo[32].width;				
			} else {
				if(!_font.symbolInfo[this.rF_symbolIndex].width) continue;
				
				_context.drawImage(this.rF_img,
					_font.symbolInfo[this.rF_symbolIndex].x, _font.symbolInfo[this.rF_symbolIndex].y,
					_font.symbolInfo[this.rF_symbolIndex].width, _font.symbolInfo[this.rF_symbolIndex].height,
					_x + this.rF_totalWidth, this.rF_baseline - _font.symbolInfo[this.rF_symbolIndex].height,
					_font.symbolInfo[this.rF_symbolIndex].width, _font.symbolInfo[this.rF_symbolIndex].height);
					
				this.rF_totalWidth += (_font.symbolInfo[this.rF_symbolIndex].width + _font.gapSize);		
			}
		}
	},


}