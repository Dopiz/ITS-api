/* use database module */
var database = require('./database');
var url = require('url');

function getProjects(req, res){
    var tmp = url.parse(req.url, true).query;
    if(tmp.id == null || tmp.id == ''){
        var queryStatement = 'Select * From project ' ;
        database.query(queryStatement, function(error, results) {
            if (error) {
                res.status(500).send({
                    status_messages: 'Internal error',
                    status_code: 500
                });
                console.log('Error: getProjects :' + error);

            } else if (results.length > 0 || results.length == 0) {

                res.status(200).send({
                    status_messages: 'getProjects success.',
                    data : results
                });
            }
            else {
                res.status(404).send({
                    status_messages: 'getProjects Not found.',
                    status_code: 404
                })
            }
        });
    }
    else{
        getProjectsById(req,res, tmp.id);
    }
}

function getProjectsById(req, res, id){
    var queryStatement = 'Select project From user WHERE id=?' ;

    database.query(queryStatement, id, function(error, results) {

        if (error) {
            res.status(500).send({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: getUserProjects :' + error);

        }
        else if(results.length == 0){
            res.status(200).send({
                status_messages: 'getUserProject success.',
                status_code: []
            });
        }
        else if (results.length > 0) {
            results[0].project = results[0].project.replace(/\"value\"/g, '"id"');
            results[0].project = results[0].project.replace(/\"label\"/g, '"project_name"');
            var jsonObj = JSON.parse(results[0].project);
            res.status(200).send({
                status_messages: "getUserProject success.",
                status_code: 200,
                data : jsonObj
            });
        }
        else {
            res.status(404).send({
                status_messages: 'getUserProjects Not found.',
                status_code: 404
            })
        }
    });
}

function addProject(req, res){
    var data_set = {
        project_name : req.body.project_name,
        project_description : req.body.project_description
    };

    var msg='';
    if((data_set.project_name==null || data_set.project_name=='') && (data_set.project_description==null || data_set.project_description=='')){
        msg += 'Please enter a project name and description';
    }
    else if(data_set.project_name == null || data_set.project_name == ''){
        msg += 'Please enter a project name';
    }
    else if(data_set.project_description == null || data_set.project_description == ''){
        msg += 'Please enter a description';
    }
    if(msg != ''){
        res.send({
            status_messages: msg,
            status_code: 400
        });
        return;
    }


    var queryStatement = 'INSERT INTO project SET ? ';

    database.query(queryStatement, data_set, function(error, results) {

        if (error) {
            res.status(500).send({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: addProject :' + error);

        }
        else {
            res.status(200).send({
                status_messages: 'addProject success.'
            });
        }
    });
}

function updateProject(req, res){
    var data_set = {
        project_name : req.body.project_name,
        project_description : req.body.project_description
    };

    var msg='';
    if((data_set.project_name==null || data_set.project_name=='') && (data_set.project_description==null || data_set.project_description=='')){
        msg += 'Please enter a project name and description';
    }
    else if(data_set.project_name == null || data_set.project_name == ''){
        msg += 'Please enter a project name';
    }
    else if(data_set.project_description == null || data_set.project_description == ''){
        msg += 'Please enter a description';
    }
    if(msg != ''){
        res.send({
            status_messages: msg,
            status_code: 400
        });
        return;
    }

    var queryStatement = 'UPDATE project SET ? WHERE id=?;' ;

    database.query(queryStatement, [data_set, req.body.id], function(error, results) {

        if (error) {
            res.status(500).send({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: updateProject :' + error);

        }
        else {
            res.status(200).send({
                status_messages: 'updateProject success.'
            });
        }
    });
}


module.exports.getProjects = getProjects;
module.exports.addProject = addProject;
module.exports.updateProject = updateProject;
