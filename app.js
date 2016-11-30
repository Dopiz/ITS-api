var express = require('express');
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express()

/* require Router setting */
var issue = require('./routes/issue');
var user = require('./routes/user');

app.use('/issue', issue);
app.use('/user', user);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

/* set router */
app.use(cors());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
