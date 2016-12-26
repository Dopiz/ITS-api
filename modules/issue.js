/* use database module */
var database = require('./database');
var moment = require('moment');
var url = require('url');

function getIssues(req, res){

    var queryStatement = 'SELECT *, DATE_FORMAT(create_date, "%Y-%m-%d") AS create_date, DATE_FORMAT(due_date, "%Y-%m-%d") AS due_date From Issue ';
    if(req.query.status)
        queryStatement += 'WHERE status=' + req.query.status ;

    database.query(queryStatement, function(error, results) {
        if (error) {
            res.status(500).send({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: getIssues :' + error);

        } else if (results.length > 0) {
            setProjectName(res, results);
        }
        else {
            res.status(404).send({
                status_messages: 'getIssues Not found.',
                status_code: 404
            })
        }
    });
}

function setProjectName(res, data){

    var queryStatement = 'SELECT * From Project';

    database.query(queryStatement, function(error, results) {
        if (error) {
            res.status(500).send({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: setProjectName :' + error);

        } else if (results.length > 0) {

            for(var i = 0 ; i < data.length ; i++){
                for(var j = 0 ; j < results.length ; j++){
                    if(data[i].project_id == results[j].id){
                        data[i].project_name = results[j].project_name
                        break ;
                    }
                }
            }
            setUserName(res, data);
        }
        else {
            res.status(404).send({
                status_messages: 'setProjectName Not found.',
                status_code: 404
            })
        }
    });
}

function setUserName(res, data){

    var queryStatement = 'SELECT * From user';

    database.query(queryStatement, function(error, results) {
        if (error) {
            res.status(500).send({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: setUserName :' + error);

        } else if (results.length > 0) {

            for(var i = 0 ; i < data.length ; i++){
                for(var j = 0 ; j < results.length ; j++){
                    if(data[i].owner_id == results[j].id){
                        data[i].owner_name = results[j].name
                        break ;
                    }
                }
            }
            for(var i = 0 ; i < data.length ; i++){
                for(var j = 0 ; j < results.length ; j++){
                    if(data[i].developer_id == results[j].id){
                        data[i].developer_name = results[j].name
                        break ;
                    }
                }
            }
            for(var i = 0 ; i < data.length ; i++){
                for(var j = 0 ; j < results.length ; j++){
                    if(data[i].tester_id == results[j].id){
                        data[i].tester_name = results[j].name
                        break ;
                    }
                }
            }

            res.status(200).send({
                status_messages: 'getIssues success.',
                data : data
            });

        }
        else {
            res.status(404).send({
                status_messages: 'setUserName Not found.',
                status_code: 404
            })
        }
    });

}

function addIssue(req, res){

    var data_set = {
        title : req.body.title,
        priority : req.body.priority,
        status : "New",
        type : req.body.type,
        project_id : req.body.project_id,
        owner_id : req.body.owner_id,
        developer_id : req.body.developer_id,
        tester_id : req.body.tester_id,
        description : req.body.description,
        image : (req.body.image) ? (req.body.image) : (null),
        create_date : moment(dateTime).format("YYYY-MM-DD"),
        due_date : req.body.due_date
    };

    var queryStatement = 'INSERT INTO issue SET ?';

    database.query(queryStatement, data_set, function(error, results) {

        if (error) {
            res.status(500).send({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: addIssue :' + error);

        } else{

            res.status(200).send({
                status_messages: 'addIssue success.'
            });
        }
    });
}

function updateIsuse(req, res){

    var data_set = {
        title : req.body.title,
        priority : req.body.priority,
        type : req.body.type,
        project_id : req.body.project_id,
        developer_id : req.body.developer_id,
        tester_id : req.body.tester_id,
        description : req.body.description,
        image : (req.body.image) ? (req.body.image) : (null),
        due_date : req.body.due_date
    };

    var queryStatement = 'UPDATE issue SET ? WHERE id=?;' ;

    database.query(queryStatement, [data_set, req.body.id], function(error, results) {

        if (error) {
            res.status(500).send({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: updateIssue :' + error);

        }
        else {
            res.status(200).send({
                status_messages: 'updateIssue success.'
            });
        }
    });
}
module.exports.getIssues = getIssues;
module.exports.addIssue = addIssue;
module.exports.updateIsuse = updateIsuse;
