/* use database module */
var database = require('./database');

function getProjects(req, res){

    var queryStatement = 'Select * From project' ;

    database.query(queryStatement, function(error, results) {

        if (error) {
            res.status(500).send({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: getProjects :' + error);

        } else if (results.length > 0) {

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

function addProject(req, res){
    var queryStatement = 'INSERT INTO project (id, project_name) VALUES (NULL, \'' + req.body.project_name + '\');' ;

    database.query(queryStatement, function(error, results) {

        if (error) {
            res.status(500).send({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: addProject :' + error);

        } 
        else {
            res.status(200).send({
                status_messages: 'addProject success.',
                data : results
            });
        }
    });
}

function updateProject(req, res){
    var queryStatement = 'UPDATE project SET project_name=? WHERE id=?;' ;

    database.query(queryStatement, [req.body.project_name, req.body.id], function(error, results) {

        if (error) {
            res.status(500).send({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: updateProject :' + error);

        } 
        else {
            res.status(200).send({
                status_messages: 'updateProject success.',
                data : results
            });
        }
    });
}

module.exports.getProjects = getProjects;
module.exports.addProject = addProject;
module.exports.updateProject = updateProject;