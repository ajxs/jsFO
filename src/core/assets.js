/**
 * @file assets.js
 * @author Anthony (ajxs [at] panoptic.online)
 * @brief Asset functionality.
 * Constains functions for working with ingame assets.
 */

"use strict";

/**
 * Creates an FRM asset from its JSON encoded format.
 * This creates the image data from the binary encoded image data by creating an HTML
 * `img` element, and setting it's `src` attribute to the encoded image data.
 * @param {*} obj The game asset JSON data to parse.
 * @returns The parsed asset.
 */
function asset_createFRMFromJSON(obj) {
	let frmItem = obj;
	frmItem.img = document.createElement('img');
	frmItem.img.src = obj.imgdata;
	return frmItem;
}


/**
 * Creates a font asset from its JSON encoded format.
 * This creates the image data from the binary encoded image data by creating an HTML
 * `img` element, and setting it's `src` attribute to the encoded image data.
 * @param {*} obj The game asset JSON data to parse.
 * @returns The parsed asset.
 */
function asset_createFontFromJSON(obj)
{
	let fontItem = obj;
	fontItem.img = document.createElement('img');
	fontItem.img.src = fontItem.imgdata;
	return fontItem;
}

/**
 * Parses an LST game asset.
 * @param {*} obj The game asset JSON data to parse.
 * @returns The parsed asset.
 */
function asset_createLSTfromJSON(obj)
{
	let lstItem = new Array(obj.data.length);
	for(let i = 0; i < obj.data.length; i++) {
		lstItem[i] = {
			data: obj.data[i],
			ptr: 0,
		}
	}

	return lstItem;
}

/**
 * This function parses the `loadData` object, creating the ingame assets from the raw
 * JSON asset data.
 * This function chooses the correct handler function to translate the asset data for each
 * ingame asset in the load data based upon its type.
 * This function is called when a level is loaded.
 * @param {*} loadData The data to parse.
 */
function asset_parseLoadData(loadData)
{
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
}
