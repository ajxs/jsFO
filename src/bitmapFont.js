"use strict";

var bitmapFontRenderer = {
	
	rF_stringlength: 0,
	rF_symbolIndex: 0,
	rF_totalWidth: 0,
	rF_baseline: 0,
	rF_img: 0,
	
	createColourImg(_font, _colour) {	// creates canvas element with coloured font
		if(_font.hasOwnProperty("img_" + _colour)) return;
	
		_font["img_" + _colour] = document.createElement("canvas");
		var _fontContext = _font["img_" + _colour].getContext("2d");
		
		_font["img_" + _colour].width = _font.img.width;
		_font["img_" + _colour].height = _font.img.height;
		
		if(_font.type == "fon") {
			_fontContext.globalCompositeOperation = "source-over";
			_fontContext.fillStyle = _colour;
			_fontContext.fillRect(0,0,_font["img_" + _colour].width,_font["img_" + _colour].height);
			
			_fontContext.globalCompositeOperation = "destination-in";
			_fontContext.drawImage(_font.img,0,0);

		} else {
			_fontContext.globalCompositeOperation = "source-over";
			_fontContext.drawImage(_font.img,0,0);			
			var imgData1 = _fontContext.getImageData(0,0,_font.img.width,_font.img.height);
			
			_fontContext.globalCompositeOperation = "source-in";
			_fontContext.fillStyle = _colour;
			_fontContext.fillRect(0,0,_font["img_" + _colour].width,_font["img_" + _colour].height);					
			var imgData2 = _fontContext.getImageData(0,0,_font.img.width,_font.img.height);
			
			for(var i=0; i < imgData2.data.length; i+=4) {	// AAF 0-9 values act as alpha blend
				imgData2.data[i+3] = imgData1.data[i];
			}
			
			_fontContext.putImageData(imgData2,0,0);
		}
		
	},
	
	renderString: function(_font, _string, _x, _y, _colour) {
		this.rF_stringlength = _string.length;
		this.rF_totalWidth = 0;
		this.rF_baseline = _y + _font.height;

		if(_colour) {
			if(!_font.hasOwnProperty("img_" + _colour)) {	// if no colourized img, create one.
				this.createColourImg(_font, _colour);
				this.rF_img = _font["img_" + _colour];
			}
			this.rF_img = _font["img_" + _colour];
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