var express = require('express');
var router = express.Router();
var path = require('path');
var project = require('../modules/project');

router.get('/getProjects', project.getProjects);
router.post('/addProject', project.addProject);
router.post('/updateProject', project.updateProject);

module.exports = router;
