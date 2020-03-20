'use strict';
var fs = require('fs');
var url = require('url');
var path = require('path');
var jobController = require('./JobController');
var routeMappings = {
	'/getjobs': jobController.getJobs
};


exports.route = function (request, response) {
	var parsedUrl = url.parse(request.url, true);
	var pathName = parsedUrl.pathname;
	if (pathName === '/') {
		pathName = '/index.html';
	}

	var fileType = path.extname(pathName);
	if (!fileType) {
		receiveApi(pathName.toLowerCase(), request, response);
		return;
	}

	var contentType = 'text/plain';
	switch (fileType) {
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.css':
			contentType = 'text/css';
			break;
		case '.json':
			contentType = 'application/json';
			break;
		case '.png':
			contentType = 'image/png';
			break;
		case '.jpg':
			contentType = 'image/jpg';
			break;
		case '.html':
			contentType = 'text/html';
			break;
	}

	response.writeHead(200, { 'Content-Type': contentType });
	var filePath = __basedir + '/dist' + pathName;
	fs.readFile(filePath, function (error, data) {
		if (error && error.code === 'ENOENT') {
			writeNotFound(response);
		} else if (data) {
			response.write(data);
			response.end();
		} else {
			response.writeHead(500);
			response.end();
		}
	});
};

var receiveApi = function (pathName, request, response) {
	console.log('API Command Received: ' + pathName);
	if (!routeMappings[pathName]) {
		writeNotFound(response);
		return;
	}

	var apiResult = routeMappings[pathName](request);
	response.writeHead(apiResult.statusCode || 200, { 'Content-Type': 'application/json' });
	response.write(JSON.stringify(apiResult.result || {}));
	response.end();
};

var writeNotFound = function (response) {
	response.writeHead(404, { 'Content-Type': 'text/html' });
	return response.end("404 Not Found");
};