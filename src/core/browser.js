/**
 * @file browser.js
 * @author Anthony (ajxs [at] panoptic.online)
 * @brief Browser interface functionality.
 * Contains functions which are related to interfacing with the web browser.
 */

"use strict";

/**
 * Returns user-agent info.
 * Instructs the application as to the browser that it is running in.
 * @returns An object containing the user-agent info.
 */
function browser_getInfo()
{
	let ua = navigator.userAgent, tem;
	let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	if(/trident/i.test(M[1])){
		tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
		return { name:'IE ', version:(tem[1]||'') };
	}
	if(M[1]==='Chrome') {
		tem = ua.match(/\bOPR\/(\d+)/);
		if(tem != null) {
			return { name:'Opera', version:tem[1] };
		}
	}
	M = M[2]? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];

	if((tem = ua.match(/version\/(\d+)/i))!=null) {
		M.splice(1,1,tem[1]);
	}

	return {
		name: M[0],
		version: M[1]
	};
}


/**
 * Tests the browser for compatibility.
 * @returns A boolean indicating compatibility for the app.
 */
function browser_test()
{
	const info = browser_getInfo();
	let testFeatures = [];

	testFeatures.push(document.createElement("canvas").getContext("2d"));
	testFeatures.push(new XMLHttpRequest());
	testFeatures.push(Array.prototype.map);

	testFeatures.forEach(element => {
		return element || false;
	});

	return true;
}
