var express = require('express');
var router = express.Router();
var path = require('path');
var issue = require('../modules/issue');

router.get('/getIssues', issue.getIssues);
router.post('/addIssue', issue.addIssue);

module.exports = router;
