var express = require('express');
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var http = require('http');
var cors = require('cors');
var app = express()
var PORT = 3000;
/* require Router setting */
var issue = require('./routes/issue');
var user = require('./routes/user');

var server = http.createServer(app).listen(PORT, function(){
	console.log('HTTP Server listening on %s', PORT);
});

/* set router */
app.use(cors());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With,content-type, Accept');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.use('/issue', issue);
app.use('/user', user);
