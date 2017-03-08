const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((request, response) => {
	console.log(`Reqeust: ${request.url}`);

	let filePath = '.' + request.url;
	if (filePath == './')
	filePath = './index.html';

	let extTypes = {
		'.js': 'text/javascript',
		'.css': 'text/css',
		'.json': 'application/json',
		'.png': 'image/png',
		'.jpg': 'image/jpg'
	};

	contentType = extTypes[path.extname(filePath)] || null;

	fs.readFile(filePath, (error, content) => {
		if (error) {
			if(error.code == 'ENOENT'){
				fs.readFile('./404.html', (error, content) => {
					response.writeHead(200, { 'Content-Type': contentType });
					response.end(content, 'utf-8');
				});
			}
			else {
				response.writeHead(500);
				response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
				response.end();
			}
		}
		else {
			response.writeHead(200, { 'Content-Type': contentType });
			response.end(content, 'utf-8');
		}
	});

}).listen(8125);
console.log('Server running at http://127.0.0.1:8125/');
