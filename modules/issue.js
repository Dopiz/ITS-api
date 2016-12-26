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
        create_date : moment().format("YYYY-MM-DD"),
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
            var history = {
                issue_id : results.insertId,
                status : "",
                content : "Edit an issue",
                comment : "",
                user_id : req.body.owner_id,
                user_name : req.body.owner_name,
            }
            addHistory(history);
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
            var history = {
                issue_id : req.body.id,
                status : "",
                content : "Edit an issue",
                comment : "",
                user_id : req.body.owner_id,
                user_name : req.body.owner_name,
            }
            addHistory(history);
            res.status(200).send({
                status_messages: 'updateIssue success.'
            });
        }
    });
}

function changeStatus(req, res){

    var status ;
    var content ;

    if(req.body.status == "New"){
        status = "Development" ;
        content = "Accept the issue."
    }
    else if(req.body.status == "Development"){
        status = "Testing" ;
        content = "Complete the development."
    }
    else if(req.body.status == "Testing" && req.body.action == "Finish"){
        status = "Done" ;
        content = "Complete the test." ;
    }
    else if(req.body.status == "Testing" && req.body.action == "Reject"){
        status = "Development" ;
        content = "Reject the issue from 'Testing'" ;
    }
    else if(req.body.status == "Done" && req.body.action == "Finish"){
        status = "Closed" ;
        content = "Close the issue" ;
    }
    else{
        status = "Testing" ;
        content = "Reject the issue from 'Done'" ;
    }

    var data_set = {
        status : status
    };

    var queryStatement = 'UPDATE issue SET ? WHERE id=?;' ;

    database.query(queryStatement, [data_set, req.body.issue_id], function(error, results) {

        if (error) {
            res.status(500).send({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: changeStatus :' + error);

        }
        else {
            var history = {
                issue_id : req.body.issue_id,
                status : req.body.status,
                content : content,
                comment : req.body.comment,
                user_id : req.body.user_id,
                user_name : req.body.user_name,
            }
            addHistory(history);

            res.status(200).send({
                status_messages: 'updateIssue success.'
            });
        }
    });
}

function addHistory(history){

    var data_set = {
        issue_id : history.issue_id,
        user_id : history.user_id,
        user_name : history.user_name,
        content : history.content,
        comment : history.comment,
        status : history.status,
        date : moment().format("YYYY-MM-DD"),
    };

    var queryStatement = 'INSERT INTO history SET ?';

    database.query(queryStatement, data_set, function(error, results) {

        if (error) {
            console.log('Error: Add History :' + error);

        } else{
            console.log("Add History Success!");
        }
    });
}

function getHistory(req, res){

    var queryStatement = 'SELECT *, DATE_FORMAT(date, "%Y-%m-%d") AS date From history WHERE issue_id=' + req.query.id;

    database.query(queryStatement, function(error, results) {
        if (error) {
            res.status(500).send({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: getHistory :' + error);

        } else if (results.length > 0 || results.length == 0) {

            res.status(200).send({
                status_messages: 'getHistory success.',
                data : results
            });
        }
        else {
            res.status(404).send({
                status_messages: 'getHistory Not found.',
                status_code: 404
            })
        }
    });
}

module.exports.getIssues = getIssues;
module.exports.addIssue = addIssue;
module.exports.updateIsuse = updateIsuse;
module.exports.changeStatus = changeStatus;
module.exports.getHistory = getHistory;
