var express = require('express');
var router = express.Router();
var path = require('path');
var user = require('../modules/user');

router.get('/getUsers', user.getUsers);
router.post('/addUser', user.addUser);
router.post('/updateUserInfo', user.updateUserInfo);
router.post('/login', user.login);

module.exports = router;
