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
	var mainLoader = new XMLHttpRequest();
	
	
	if(_debug.remoteLoading) {
		console.log("MainLoadState: loading remotely");
		var loadURL = "jsfdata/main.jsf";
		
	} else {	// load locally
		console.log("MainLoadState: loading locally");
		var loadURL = "jsfdata/main.jsf";		
		
	}
	
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
			
		console.log("MainLoadState: init text assets");
		_assets["text/english/game/pro_crit.msg"].msg = new Array();		// init textIDs
		for(var l = 0; l < _assets["text/english/game/pro_crit.msg"].data.length; l++) {
			var split = _assets["text/english/game/pro_crit.msg"].data[l].split("{");
			for(var k = 0; k < split.length; k++) split[k] = split[k].replace(/({|})/,"");
			_assets["text/english/game/pro_crit.msg"].msg[split[1]] = {
				soundID : split[2], text : split[3],
			}
		}

		_assets["text/english/game/pro_item.msg"].msg = new Array();
		for(var l = 0; l < _assets["text/english/game/pro_item.msg"].data.length; l++) {
			var split = _assets["text/english/game/pro_item.msg"].data[l].split("{");
			for(var k = 0; k < split.length; k++) split[k] = split[k].replace(/({|})/,"");
			_assets["text/english/game/pro_item.msg"].msg[split[1]] = {
				soundID : split[2], text : split[3],
			}
		}

		_assets["text/english/game/pro_wall.msg"].msg = new Array();
		for(var l = 0; l < _assets["text/english/game/pro_wall.msg"].data.length; l++) {
			var split = _assets["text/english/game/pro_wall.msg"].data[l].split("{");
			for(var k = 0; k < split.length; k++) split[k] = split[k].replace(/({|})/,"");
			_assets["text/english/game/pro_wall.msg"].msg[split[1]] = {
				soundID : split[2], text : split[3],
			}
		}

		_assets["text/english/game/pro_misc.msg"].msg = new Array();
		for(var l = 0; l < _assets["text/english/game/pro_misc.msg"].data.length; l++) {
			var split = _assets["text/english/game/pro_misc.msg"].data[l].split("{");
			for(var k = 0; k < split.length; k++) split[k] = split[k].replace(/({|})/,"");
			_assets["text/english/game/pro_misc.msg"].msg[split[1]] = {
				soundID : split[2], text : split[3],
			}
		}

		_assets["text/english/game/pro_tile.msg"].msg = new Array();
		for(var l = 0; l < _assets["text/english/game/pro_tile.msg"].data.length; l++) {
			var split = _assets["text/english/game/pro_tile.msg"].data[l].split("{");
			for(var k = 0; k < split.length; k++) split[k] = split[k].replace(/({|})/,"");
			_assets["text/english/game/pro_tile.msg"].msg[split[1]] = {
				soundID : split[2], text : split[3],
			}
		}

		_assets["text/english/game/pro_scen.msg"].msg = new Array();
		for(var l = 0; l < _assets["text/english/game/pro_scen.msg"].data.length; l++) {
			var split = _assets["text/english/game/pro_scen.msg"].data[l].split("{");
			for(var k = 0; k < split.length; k++) split[k] = split[k].replace(/({|})/,"");
			_assets["text/english/game/pro_scen.msg"].msg[split[1]] = {
				soundID : split[2], text : split[3],
			}
		}			
			
		console.log("MainLoadState: mainState context menuItems init");
		mainState.contextMenu.menuItems = [{
				img: _assets["art/intrface/usegetn.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/usegeth.frm"].frameInfo[0][0].img,
				action: "use",
				active: true,
			}, {
				img: _assets["art/intrface/talkn.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/talkh.frm"].frameInfo[0][0].img,
				action: "talk",
				active: true,
			}, {
				img: _assets["art/intrface/lookn.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/lookh.frm"].frameInfo[0][0].img,
				action: "look",
				active: true,
			}, {
				img: _assets["art/intrface/pushn.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/pushh.frm"].frameInfo[0][0].img,
				action: "push",
				active: false,
			},  {
				img: _assets["art/intrface/rotaten.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/rotateh.frm"].frameInfo[0][0].img,
				action: "rotate",
				active: false,
			}, {
				img: _assets["art/intrface/skilln.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/skillh.frm"].frameInfo[0][0].img,
				action: "skill",
				active: true,
			}, {
				img: _assets["art/intrface/invenn.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/invenh.frm"].frameInfo[0][0].img,
				action: "cancel",
				active: true,
			}, {
				img: _assets["art/intrface/canceln.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/cancelh.frm"].frameInfo[0][0].img,
				action: "cancel",
				active: true,
			}];
		
		console.log("MainLoadState: load complete");
		main_menu();	// launch main menu
	};

	var transferFailed = function(evt) { };

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
	
	_context.beginPath();
	_context.moveTo(barX-6, barY-6);
	_context.lineTo((barX-6) + fullWidth + 12, barY-6);
	_context.lineTo((barX-6) + fullWidth + 12, barY-6+76);
	_context.lineTo(barX-6, barY-6+76);
	_context.lineTo(barX-6, barY-6);
	_context.closePath();
	_context.lineWidth = 4;
	_context.strokeStyle = "#afb1a7";	
	_context.stroke();
	
	_context.fillStyle = "#afb1a7";
	_context.fillRect(barX,barY,barWidth,64);

	_context.globalAlpha = 1;	
	
}