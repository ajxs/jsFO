function asset_createFRMFromJSON(obj) {
	var frmItem = obj;
	for(var d = 0; d < frmItem.frameInfo.length; d++) {
		for(var f = 0; f < frmItem.nFrames; f++) {
			frmItem.frameInfo[d][f].img = document.createElement('img');
			frmItem.frameInfo[d][f].img.src = frmItem.frameInfo[d][f].imgdata;
		}
	}
	return frmItem;
};


function asset_createFontFromJSON(obj) {
	var fontItem = obj;
	fontItem.img = document.createElement('img');
	fontItem.img.src = fontItem.imgdata;
	return fontItem;
};


function asset_createMSGFromJSON(obj) {
	var msgItem = obj;
	
	msgItem.msg = new Array();		// init textIDs
	for(var l = 0; l < msgItem.data.length; l++) {
		var split = msgItem.data[l].split("{");
		for(var k = 0; k < split.length; k++) split[k] = split[k].replace(/({|})/,"");
		msgItem.msg[split[1]] = {
			soundID : split[2], text : split[3],
		}
	}

	return msgItem;
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
			case "msg":
				_assets[key] = asset_createMSGFromJSON(loadData[key]);
				break;
				
/*			case "int":
				break;
			case "txt":
				break;
			case "pro":
				break;
				
*/
			default:
				_assets[key] = loadData[key];
				break;
			
			
		}

	
	}
	
};