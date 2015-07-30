function browser_getCallFrame() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		null;
};

var browser_getError = function(msg) {
	if(window.console) {
		if(window.console.error) {
			window.console.error(msg);
		} else if(window.console.log) {
			window.console.log(msg);
		}
	}
};

function browser_getInfo() {		// returns user-agent info
	var ua = navigator.userAgent, tem;
	var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
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
};

function browser_test() {
	var info = browser_getInfo();
	var testFeatures = [];
	
	testFeatures.push(document.createElement('canvas').getContext('2d'));
	testFeatures.push(new XMLHttpRequest());
	testFeatures.push(window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		null);
	testFeatures.push(Array.prototype.map);
	
	testFeatures.forEach(function(element) {
		if(!element) return false;
	});
	
	return true;	
};