var express = require('express');
var router = express.Router();
var path = require('path');
var user = require('../modules/user');

router.get('/getUsers', user.getUsers);

module.exports = router;
