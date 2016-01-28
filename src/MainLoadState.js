"use strict";

class MainLoadState extends GameState {
	constructor() {
		super();

		MainLoadState.prototype.loadPercentage = 0;
		this.backgroundImage = document.getElementById("MainLoadState_bg");

		let payloadSuccess = function(res) {
			console.log("MainLoadState: download complete - parsing loadData");
			asset_parseLoadData(res);
			contextMenuState.init.call(contextMenuState);		// init contextMenu items
			main_menu();
		}.bind(this);

		console.log("MainLoadState: loading remotely");
		main_loadJsonPayload("jsfdata/main.jsf")
			.then(payloadSuccess)
			.catch(main_payloadError);
	};

	init() { };		// use arguments here to pass saved state data.
	input(e) { };
	update() { };

	render() {
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

};
