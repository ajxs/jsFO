"use strict";

class MainLoadState extends GameState {
	constructor() {
		super();

		MainLoadState.prototype.loadPercentage = 0;
		this.backgroundImage = document.getElementById("MainLoadState_bg");

		console.log("MainLoadState: loading remotely");
		main_loadJsonPayload("jsfdata/main.jsf")
			.then(res => {
				console.log("MainLoadState: download complete - parsing loadData");
				asset_parseLoadData(res);
				main_menu();
			}).catch(main_payloadError);
	};

	render() {
		_context.globalAlpha = 1;

		var fullWidth = ((SCREEN_WIDTH/2)|0);
		var barWidth = fullWidth * this.loadPercentage;
		var barX = fullWidth - (fullWidth/2)|0;
		var barY = SCREEN_HEIGHT - 128;

		_context.drawImage(this.backgroundImage,0,0,1024,768,0,0,SCREEN_WIDTH,SCREEN_HEIGHT);

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
