/* use database module */
var database = require('./database');
var moment = require('moment');
var nodemailer = require('nodemailer');
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

        }else if(results.length > 0 ) {
            setProjectName(res, results);
        }else if(results.length == 0){
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
            var id_list = [];
            var history = {
                issue_id : results.insertId,
                status : "",
                content : "Create an issue",
                comment : "",
                user_id : req.body.owner_id,
                user_name : req.body.owner_name,
                action : "Create"
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
                action : "Edit"
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
                action :req.body.action
            }
            addHistory(history);

            var mailData = {
                title : req.body.title,
                project_name : req.body.project_name,
                user_name : req.body.user_name,
                owner_id : req.body.owner_id,
                developer_id : req.body.developer_id,
                tester_id : req.body.tester_id,
                priority : req.body.priority,
                content : content,
                comment : req.body.comment
            }
            sendEmail(mailData);

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
        action : history.action,
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

function sendEmail(data){

    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "wayne26582@gmail.com",
            pass: "x0937386289"
        }
    });

    var queryStatement = 'SELECT * From user';

    database.query(queryStatement, function(error, results) {
        if(error){
            console.log('Error: getUsers :' + error);
        }else{

            var owner_name, developer_name, tester_name, owner_email, developer_email, tester_email;

            for(var i = 0 ; i < results.length ; i++){
                if(results[i].id == data.owner_id){
                    owner_name = results[i].name ;
                    owner_email = results[i].email;
                }else if(results[i].id == data.developer_id){
                    developer_name = results[i].name ;
                    developer_email = results[i].email;
                }else if(results[i].id == data.tester_id){
                    tester_name = results[i].name ;
                    tester_email = results[i].email;
                }
            }

            var emailList = owner_email + ", " + developer_email + ", " + tester_email ;

            var html = "<p><strong>Issue title : </strong>" + data.title + "</p>";
            html += "<p><strong>Project : </strong>" + data.project_name + "</p>";
            html += "<p><strong>Priority : </strong>" + data.priority + "</p>";
            html += "<p><strong>Owner : </strong>" + owner_name + "</p>";
            html += "<p><strong>Developer : </strong>" + developer_name + "</p>";
            html += "<p><strong>Tester : </strong>" + tester_name + "</p>";
            html += "<p><strong>Content : </strong>" + data.content + "</p>";
            html += (data.comment)?("<p><strong>Comment : </strong>" + data.comment + "</p>"):("");

            smtpTransport.sendMail({
                from: '"ITS" <wayne26582@gmail.com>',
                to: emailList,
                subject: "系統訊息",
                text: "text",
                html : html
            }, function(error, response){
               if(error)
                   console.log(error);
               else
                   console.log("Message sent: " + response.message);
            })
            smtpTransport.close();
        }
    });
}

function getReport(req, res){
    var queryStatement = 'SELECT *, DATE_FORMAT(date, "%Y-%m-%d") AS date From history WHERE issue_id=' + req.query.id;

    database.query(queryStatement, function(error, results) {
        if (error) {
            res.status(500).send({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: getReport :' + error);

        } else if (results.length > 0 || results.length == 0) {

            res.status(200).send({
                status_messages: 'getReport success.',
                data : setReport(results)
            });
        }
        else {
            res.status(404).send({
                status_messages: 'getReport Not found.',
                status_code: 404
            })
        }
    });
}

function setReport(data){

    var total_time;
    var new_time = 0 ;
    var development_time = 0;
    var development_finish = 0 ;
    var testing_time = 0;
    var testing_finish = 0 ;
    var testing_reject = 0 ;
    var done_time = 0;
    var done_finish = 0 ;
    var done_reject = 0 ;
    var oneDay = 60*60*24*1000;
    var current_time = data[0].date;
    /* set total time*/
    var startDate = new Date(data[0].date) ;
    var endDate = new Date(data[data.length-1].date) ;
    total_time = (endDate - startDate)/oneDay ;

    var new_count = 0 ;
    var dev_count = 0 ;
    var testing_count = 0 ;
    var done_count = 0 ;

    data.forEach(function(item){

        switch(item.status){
            case 'Development' :
                development_finish++;
            break;
            case 'Testing' :
                if(item.action == "Finish")
                    testing_finish++;
                else
                    testing_reject++;
            break;
            case 'Done' :
                if(item.action == "Finish")
                    done_finish++;
                else
                    done_reject++;
            break;
        };

        if(item.action == "Create" || item.action == "Edit"){

        }
        else if(current_time == item.date){
            /*計算比例*/
            switch(item.status){
                case 'New' :
                    new_count++;
                break;
                case 'Development' :
                    dev_count++;
                break;
                case 'Testing' :
                    testing_count++;
                break;
                case 'Done' :
                    done_count++;
                break;
            };

        }else if(item.status == "Done" && item.action == "Finish"){

            done_count++;

            var part = 1/(new_count + dev_count + testing_count + done_count);
            new_time += part * new_count ;
            development_time += part * dev_count;
            testing_time += part * testing_count;
            done_time += part * done_count;

        }else{
            var part = 1/(new_count + dev_count + testing_count + done_count);
            new_time += part * new_count ;
            development_time += part * dev_count;
            testing_time += part * testing_count;
            done_time += part * done_count;

            current_time = item.date ;
            new_count = 0 ;
            dev_count = 0;
            testing_count = 0;
            done_count = 0;

            /*計算比例*/
            switch(item.status){
                case 'New' :
                    new_count++;
                break;
                case 'Development' :
                    dev_count++;
                break;
                case 'Testing' :
                    testing_count++;
                break;
                case 'Done' :
                    done_count++;
                break;
            };
        }
    })

    var pieChartData = [] ;
    var item ;
    if(new_time){
        item = {
            value : Math.round((new_time/total_time)*1000)/10,
            label : "New"
        }
        pieChartData.push(item);
    }

    if(development_time){
        item = {
            value : Math.round((development_time/total_time)*1000)/10,
            label : "Development"
        }
        pieChartData.push(item);
    }

    if(testing_time){
        item = {
            value : Math.round((testing_time/total_time)*1000)/10,
            label : "Testing"
        }
        pieChartData.push(item);
    }

    if(done_time){
        item = {
            value : Math.round((done_time/total_time)*1000)/10,
            label : "Done"
        }
        pieChartData.push(item);
    }

    var result = {
        pieChartData : pieChartData,
        total_time : total_time,
        new_time : Math.round(new_time*10)/10,
        development_time : Math.round(development_time*10)/10,
        development_finish : development_finish,
        testing_time : Math.round(testing_time*10)/10,
        testing_finish : testing_finish,
        testing_reject : testing_reject,
        done_time : Math.round(done_time*10)/10,
        done_finish : done_finish,
        done_reject : done_reject
    }

    return result ;

}

module.exports.getIssues = getIssues;
module.exports.addIssue = addIssue;
module.exports.updateIsuse = updateIsuse;
module.exports.changeStatus = changeStatus;
module.exports.getHistory = getHistory;
module.exports.getReport = getReport;
