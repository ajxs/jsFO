'use strict';

function asset_createFRMFromJSON(obj) {
	let frmItem = obj;
	/* for(let d = 0; d < frmItem.frameInfo.length; d++) {
		for(let f = 0; f < frmItem.nFrames; f++) {
			frmItem.frameInfo[d][f].img = document.createElement('img');
			frmItem.frameInfo[d][f].img.src = frmItem.frameInfo[d][f].imgdata;
		}
	} */

	frmItem.img = document.createElement('img');
	frmItem.img.src = frmItem.imgdata;

	return frmItem;
};


function asset_createFontFromJSON(obj) {
	let fontItem = obj;
	fontItem.img = document.createElement('img');
	fontItem.img.src = fontItem.imgdata;
	return fontItem;
};

function asset_createLSTfromJSON(obj) {
	let lstItem = new Array(obj.data.length);
	for(let i = 0; i < obj.data.length; i++) {
		lstItem[i] = {
			data: obj.data[i],
			ptr: 0,
		}
	}

	return lstItem;
};

function asset_parseLoadData(loadData) {		// parses loadData as JSON and properly creates all assets.

	for(let key in loadData) {
		switch(loadData[key].type) {
			case "frm":
				_assets[key] = asset_createFRMFromJSON(loadData[key]);
				break;
			case "aaf":
				_assets[key] = asset_createFontFromJSON(loadData[key]);
				break;
			case "fon":
				_assets[key] = asset_createFontFromJSON(loadData[key]);
				break;
			case "lst":
				_assets[key] = asset_createLSTfromJSON(loadData[key]);
				break;
			case "msg":
			case "int":
			case "txt":
			case "pro":

			default:
				_assets[key] = loadData[key];
				break;

		}
	}
};
