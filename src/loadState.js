"use strict";

function loadState() {
	gameState.call(this);

}

loadState.prototype = new gameState();
loadState.prototype.constructor = loadState;
loadState.prototype.loadImage = 0;

loadState.prototype.loadPercentage = 0;

loadState.prototype.init = function(_saveState) {		// use arguments here to pass saved state data.
	
	this.loadImage = document.getElementById("loadState_loadScreen");
	var loadStatePtr = this;
	
	if(_debug.remoteLoading) {
		console.log("loadState: loading remotely");

		var mainLoader = new XMLHttpRequest();
		//var loadURL = "src/loader/loader_main.cgi";
		//var loadURL = "http://code.ht/ml/jsf/src/loader/loader_main.cgi";
		//var loadURL = "city1.jsf"
		
		switch(_saveState.map) {
			case "geckpwpl.map":
				var loadURL = "geckpwpl.jsf"
				break;
			case "city1.map":
				var loadURL = "city1.jsf"
				break;			
		}
		
		var currentAssets = "";	
		
		var clientData = "map="+_saveState.map;
		
		var transferComplete = function(evt) {
			console.log("loadState: download complete");
			var loadData = JSON.parse(mainLoader.responseText);
			
			console.log("loadState: creating sprites");
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
			
			mainState.init(_saveState);
			stateQ.splice(stateQ.indexOf(loadState),1);	
			stateQ.push(mainState);
			
			console.log("loadState: load complete");
			
		};
	
		var transferFailed = function(evt) {
			
			
			
		};
		
		var updateProgress = function(evt) {
			if(evt.lengthComputable) {
				loadStatePtr.loadPercentage = evt.loaded / evt.total;
			} else {
				console.log("loadState: cannot process load progress");
			}	
			
		};
	
		
		mainLoader.addEventListener("progress", updateProgress, false);
		mainLoader.addEventListener("load", transferComplete, false);
		mainLoader.addEventListener("error", transferFailed, false);		
		
		mainLoader.open("POST", loadURL, true);
		
		mainLoader.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		//mainLoader.setRequestHeader('accept-encoding','gzip');
		mainLoader.overrideMimeType("application/gzip");	
		mainLoader.send(clientData);
		
		console.log("loadState: loading data from server");		
		
	} else {	// load locally
		
		
	}	
	
}


loadState.prototype.input = function(e) { }

loadState.prototype.update = function() { }


loadState.prototype.render = function() {
	_context.globalAlpha = 1;
	_context.fillStyle = "rgb(0,10,0)";
	_context.fillRect(0,0,_screenWidth,_screenHeight);
	
	var fullWidth = ((_screenWidth/2)|0);
	var barWidth = fullWidth * this.loadPercentage;
	var barX = fullWidth - (fullWidth/2)|0;
	var barY = _screenHeight - 128;
	
	
	_context.beginPath();
	_context.moveTo(barX-6, barY-6);
	_context.lineTo((barX-6) + fullWidth + 12, barY-6);
	_context.lineTo((barX-6) + fullWidth + 12, barY-6+76);
	_context.lineTo(barX-6, barY-6+76);
	_context.lineTo(barX-6, barY-6);
	_context.closePath();
	_context.lineWidth = 4;
	_context.strokeStyle = "rgb(130,240,170)";	
	_context.stroke();
	
	_context.fillStyle = "rgb(130,240,170)";
	_context.fillRect(barX,barY,barWidth,64);
	
	var flickerChance = 0.02;	// flicker
	if(Math.random() > 1-flickerChance) {
		_context.globalAlpha = Math.random()*0.35;
		_context.fillStyle = "rgb(255,255,255)";
		_context.fillRect(0,0,_screenWidth,_screenHeight);
	}
	
	_context.globalAlpha = 0.07;	// scanlines, consider replacing with hardcoded image
	_context.fillStyle = "rgb(255,255,255)";	
	var lines = 0;
	while(lines < _screenHeight) {
		_context.fillRect(0,lines,_screenWidth,4);
		lines += 8;
	
	}

	_context.globalAlpha = 1;	
	
	/*_context.drawImage(this.loadImage,0,0);
	
	_context.fillStyle = "rgb(130,240,170)";	// optional clear
	
	var barWidth = 640 * this.loadPercentage;
	
	_context.fillRect(192,600,barWidth,64); */
	
	
}