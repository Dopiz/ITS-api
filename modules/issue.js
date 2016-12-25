/* use database module */
var database = require('./database');
var url = require('url');

function getIssues(req, res){
    var tmp = url.parse(decodeURIComponent(req.url), true).search;
    if(tmp == null || tmp == ''){
        //var queryStatement = 'SELECT *, DATE_FORMAT(create_date, "%Y-%m-%d") AS createDate, DATE_FORMAT(due_date, "%Y-%m-%d") AS dueDate  FROM issue' ;
        var queryStatement = 'SELECT id, project_id, priority, status, type, owner_id, developer_id, tester_id, DATE_FORMAT(create_date, "%Y-%m-%d") AS create_Date, DATE_FORMAT(due_date, "%Y-%m-%d") AS due_Date  FROM issue' ;

        database.query(queryStatement, function(error, results) {

            if (error) {
                res.status(500).send({
                    status_messages: 'Internal error',
                    status_code: 500
                });
                console.log('Error: getIssues :' + error);

            } else if (results.length > 0) {

                res.status(200).send({
                    status_messages: 'getIssues success.',
                    data : results
                });
            }
            else {
                res.status(404).send({
                    status_messages: 'getIssues Not found.',
                    status_code: 404
                })
            }
        });
    }
    else {
        tmp = tmp.replace(/&/g, ' AND ');
        getIssuesByData(req, res, 'Where ' + tmp.substr(1));
    }
}

function getIssuesByData(req, res, where){
    //var queryStatement = 'SELECT *, DATE_FORMAT(create_date, "%Y-%m-%d") AS createDate, DATE_FORMAT(due_date, "%Y-%m-%d") AS dueDate  FROM issue' ;
    var queryStatement = 'SELECT id, project_name, priority, status, type, owner_id, developer_id, tester_id, DATE_FORMAT(create_date, "%Y-%m-%d") AS create_Date, DATE_FORMAT(due_date, "%Y-%m-%d") AS due_Date  FROM issue ' + where ;
    database.query(queryStatement, function(error, results) {

        if (error) {
            res.status(500).send({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: getIssuesByData :' + error);

        } else if (results.length > 0) {

            res.status(200).send({
                status_messages: 'getIssuesByData success.',
                data : results
            });
        }
        else {
            res.status(404).send({
                status_messages: 'getIssuesByData Not found.',
                status_code: 404
            })
        }
    });
}

var issue_field = ['title', 'priority', 'status', 'type', 'owner', 'project id', 'developer', 'tester', 'create date', 'due date'];

function addIssue(req, res){
    var msg = 'Please enter a ';
    var index = 0;  //記欄位index
    var count = 0;  //計算缺了幾個

    var data_set = {
        title : req.body.title,
        priority : req.body.priority,
        status : (req.body.status) ? (req.body.status) : ("New"),
        type : req.body.type,
        project_id : req.body.project_id,
        owner_id : req.body.owner_id,
        developer_id : req.body.developer_id,
        tester_id : req.body.tester_id,
        description : req.body.description,
        image : req.body.image,
        create_date : req.body.create_date,
        due_date : req.body.due_date
    };

    // for(x in data_set){
    //     if (data_set[x]==null || data_set[x]=='') {
    //         if(count!=0)
    //             msg += ', ';
    //         msg += issue_field[index];
    //         count++;
    //     }
    //     index++;
    // }
    //
    // if(count != 0){
    //     res.send({
    //         status_messages: msg,
    //         status_code: 400
    //     });
    //     return;
    // }


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


module.exports.getIssues = getIssues;
module.exports.addIssue = addIssue;
