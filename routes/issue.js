var express = require('express');
var router = express.Router();
var path = require('path');
var issue = require('../modules/issue');

router.get('/getIssues', issue.getIssues);
router.post('/addIssue', issue.addIssue);
router.post('/updateIssue', issue.updateIsuse);
router.post('/changeStatus', issue.changeStatus);
router.get('/getHistory', issue.getHistory);
router.get('/getReport', issue.getReport);

module.exports = router;
