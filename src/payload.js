'use strict';

function payloadError(error) {
	console.log(error);
};

function loadJsonPayload(url) {
	return new Promise(
		function(resolve, reject) {
			let payloadXHR = new XMLHttpRequest();

			payloadXHR.onload = function() {
				resolve(this.response);
			};

			payloadXHR.onerror = function() {
				reject(this.statusText);
			};

			payloadXHR.open("GET", url, true);
			payloadXHR.responseType = 'json';
			payloadXHR.send();
		}
	);
};
