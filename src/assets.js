function asset_createFRMFromJSON(obj) {

	var frmItem = obj;
	for(var d = 0; d < frmItem.frameInfo.length; d++) {
		for(var f = 0; f < frmItem.nFrames; f++) frmItem.frameInfo[d][f].imgdata = new Uint8Array(frmItem.frameInfo[d][f].imgdata);
	}
	return frmItem;
};


function asset_createFontFromJSON(obj) {
	var fontItem = obj;
	fontItem.img = document.createElement('img');
	fontItem.img.src = fontItem.imgdata;
	return fontItem;
};

function asset_createLSTfromJSON(obj) {
	var lstItem = new Array(obj.data.length);
	for(var i = 0; i < obj.data.length; i++) {
		lstItem[i] = {
			data: obj.data[i],
			ptr: 0,
		}
	}

	return lstItem;
};

function asset_parseLoadData(data) {		// parses loadData as JSON and properly creates all assets.
	var loadData = JSON.parse(data);

	for(var key in loadData) {
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
