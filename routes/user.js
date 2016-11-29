var express = require('express');
var router = express.Router();
var path = require('path');
var issue = require('../modules/user');

router.get('/getUsers', issue.getUsers);

module.exports = router;