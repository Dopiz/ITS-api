var express = require('express');
var router = express.Router();
var path = require('path');
var user = require('../modules/user');

router.get('/getUsers', user.getUsers);
router.post('/addUser', user.addUser);
router.post('/updateUser', user.updateUser);
router.post('/login', user.login);

module.exports = router;
