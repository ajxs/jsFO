"use strict";

function MainLoadState() {
	GameState.call(this);
}

MainLoadState.prototype = new GameState();
MainLoadState.prototype.constructor = MainLoadState;
MainLoadState.prototype.backgroundImage = 0;

MainLoadState.prototype.loadPercentage = 0;

MainLoadState.prototype.init = function() {		// use arguments here to pass saved state data.

	this.backgroundImage = document.getElementById("MainLoadState_bg");
	var MainLoadStatePtr = this;
	
	if(_debug.remoteLoading) {
		console.log("MainLoadState: loading remotely");

		var mainLoader = new XMLHttpRequest();
		var loadURL = "jsfdata/main.jsf";
		
		var transferComplete = function(evt) {
			console.log("MainLoadState: download complete");
			var loadData = JSON.parse(mainLoader.responseText);
			
			console.log("MainLoadState: creating sprites");
			for(var key in loadData) {
				_assets[key] = loadData[key];
				if(_assets[key].nFrames) { // if frm - build images
					var nDir = _assets[key].frameInfo.length;
					for(var d = 0; d < nDir; d++) {
						for(var f = 0; f < _assets[key].nFrames; f++) {
							_assets[key].frameInfo[d][f].img = document.createElement('img');
							_assets[key].frameInfo[d][f].img.src = _assets[key].frameInfo[d][f].imgdata;
						}
					}
				} else if(_assets[key].symbolInfo) {	// fonts
					_assets[key].img = document.createElement('img');
					_assets[key].img.src = _assets[key].imgdata;
				}
			}
			
			console.log("MainLoadState: load complete");
			main_menu();	// launch main menu
		};
	
		var transferFailed = function(evt) {
		};
		
		var updateProgress = function(evt) {
			if(evt.lengthComputable) {
				MainLoadStatePtr.loadPercentage = evt.loaded / evt.total;
			} else {
				console.log("MainLoadState: cannot process load progress");
			}
		};
	
		
		mainLoader.addEventListener("progress", updateProgress, false);
		mainLoader.addEventListener("load", transferComplete, false);
		mainLoader.addEventListener("error", transferFailed, false);		
		
		mainLoader.open("POST", loadURL, true);
		
		mainLoader.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		//mainLoader.setRequestHeader('accept-encoding','gzip');
		mainLoader.overrideMimeType("application/gzip");	
		mainLoader.send();
		
		console.log("MainLoadState: loading data from server");		
		
	} else {	// load locally
		
		
	}	
	
}


MainLoadState.prototype.input = function(e) { }

MainLoadState.prototype.update = function() { }


MainLoadState.prototype.render = function() {
	_context.globalAlpha = 1;
	
	var fullWidth = ((_screenWidth/2)|0);
	var barWidth = fullWidth * this.loadPercentage;
	var barX = fullWidth - (fullWidth/2)|0;
	var barY = _screenHeight - 128;
	
	_context.drawImage(this.backgroundImage,0,0,1024,768,0,0,_screenWidth,_screenHeight);
	
	_context.fillStyle = "#931912";
	_context.fillRect(barX,barY,fullWidth,72);
	
	_context.beginPath();
	_context.moveTo(barX-6, barY-6);
	_context.lineTo((barX-6) + fullWidth + 12, barY-6);
	_context.lineTo((barX-6) + fullWidth + 12, barY-6+76);
	_context.lineTo(barX-6, barY-6+76);
	_context.lineTo(barX-6, barY-6);
	_context.closePath();
	_context.lineWidth = 4;
	_context.strokeStyle = "#f8f49c";	
	_context.stroke();
	
	_context.fillStyle = "#f8f49c";
	_context.fillRect(barX,barY,barWidth,64);

	_context.globalAlpha = 1;	
	
}