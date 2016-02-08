"use strict";

class LoadState extends GameState {
	constructor() {
		super();

		this.loadImage = 0;
		this.overlay = document.getElementById("loadState_overlay");
		this.loadPercentage = 0;

	};

	init(_saveState) {		// use arguments here to pass saved state data.
		console.log("LoadState: loading locally");

		main_loadJsonPayload("jsfdata/" + _saveState.map.split(".")[0] + ".jsf")
			.then(res => {
				console.log("MainLoadState: download complete - parsing loadData");
				asset_parseLoadData(res);

				var createAssetPointers = function(type) {
					_assets["art/" + type + "/" + type + ".lst"].forEach(item => {
						item.ptr = _assets["art/" + type + "/" + item.data];
					});
				};

				createAssetPointers("tiles");
				createAssetPointers("items");
				createAssetPointers("scenery");
				createAssetPointers("misc");

				console.log("LoadState: load complete");
				main_gameStateFunction("main_initGameState", {
					saveState: _saveState
				});

			}).catch(main_payloadError);

	};

	render() {		// @TODO: REMOVE
		_context.globalAlpha = 1;
		_context.fillStyle = "rgb(0,10,0)";
		_context.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);

		var fullWidth = ((SCREEN_WIDTH/2)|0);
		var barWidth = fullWidth * this.loadPercentage;
		var barX = fullWidth - (fullWidth/2)|0;
		var barY = SCREEN_HEIGHT - 128;

		_context.drawImage(this.overlay,0,0,1024,768,0,0,SCREEN_WIDTH,SCREEN_HEIGHT);

		_context.fillStyle = "rgb(0,10,0)";
		_context.fillRect(barX,barY,fullWidth,64);

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
			_context.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
		}

		_context.globalAlpha = 0.07;	// scanlines, consider replacing with hardcoded image
		_context.fillStyle = "rgb(255,255,255)";
		var lines = 0;
		while(lines < SCREEN_HEIGHT) {
			_context.fillRect(0,lines,SCREEN_WIDTH,4);
			lines += 8;

		}

		_context.globalAlpha = 1;
	};

};
