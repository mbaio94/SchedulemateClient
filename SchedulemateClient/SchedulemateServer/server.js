'use strict';
var http = require('http');
var port = process.env.PORT || 1337;
var opn = require('opn');
var router = require('./Modules/Router.js');

global.__basedir = __dirname;

http.createServer(function (req, res) {
	router.route(req, res);
}).listen(port);

// opens the url in the default browser 
opn('http://localhost:' + port);
console.log('Initialized site to http://localhost:' + port);