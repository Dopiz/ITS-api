var express = require('express');
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');

var app = express()

/* require Router setting */
var issue = require('./routes/issue');
var user = require('./routes/user');

app.use('/issue', issue);
app.use('/user', user);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
