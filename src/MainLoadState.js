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
	
	console.log("MainLoadState: loading remotely");
	var loadURL = "jsfdata/main.jsf";

	var transferComplete = function(evt) {
		console.log("MainLoadState: download complete - parsing loadData");
		
		asset_parseLoadData(evt.target.responseText);
			
		console.log("MainLoadState: mainState context menuItems init");
		
		ContextMenuState.prototype.menu_talk = {
				img: _assets["art/intrface/talkn.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/talkh.frm"].frameInfo[0][0].img,
				action: "talk",
			};
			
		ContextMenuState.prototype.menu_look = {
				img: _assets["art/intrface/lookn.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/lookh.frm"].frameInfo[0][0].img,
				action: "look",
			};
			
		ContextMenuState.prototype.menu_use = {
				img: _assets["art/intrface/usegetn.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/usegeth.frm"].frameInfo[0][0].img,
				action: "use",
			};
			
		ContextMenuState.prototype.menu_push = {
				img: _assets["art/intrface/pushn.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/pushh.frm"].frameInfo[0][0].img,
				action: "push",
			};
			
		ContextMenuState.prototype.menu_rotate = {
				img: _assets["art/intrface/rotaten.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/rotateh.frm"].frameInfo[0][0].img,
				action: "rotate",
			};
			
		ContextMenuState.prototype.menu_cancel = {
				img: _assets["art/intrface/canceln.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/cancelh.frm"].frameInfo[0][0].img,
				action: "cancel",
			};
			
		ContextMenuState.prototype.menu_inven = {
				img: _assets["art/intrface/invenn.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/invenh.frm"].frameInfo[0][0].img,
				action: "cancel",
			};
			
		ContextMenuState.prototype.menu_skill = {
				img: _assets["art/intrface/skilln.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/skillh.frm"].frameInfo[0][0].img,
				action: "skill",
			};
			
		ContextMenuState.prototype.menu_get = {
				img: _assets["art/intrface/usegetn.frm"].frameInfo[0][0].img,
				hoverImg: _assets["art/intrface/usegeth.frm"].frameInfo[0][0].img,
				action: "get",
			};
		
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

	//mainLoader.open("POST", loadURL, true);

	//mainLoader.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	//mainLoader.setRequestHeader('accept-encoding','gzip');
	//mainLoader.overrideMimeType("application/gzip");	
	
	mainLoader.open("GET", loadURL, true);
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
	
};