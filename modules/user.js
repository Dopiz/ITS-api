/* use database module */
var database = require('./database');

function getUsers(req, res){
    if(req.query.title == null){
        res.status(400).send({
            status_messages: 'Please select a title.',
            status_code: 400
        });
        return ;
    }

    var queryStatement = (req.query.title == 'all') ?
      ('Select * From user Where title!=\'Admin\'') : ("Select * From user Where title='" + req.query.title + "'");

    database.query(queryStatement, function(error, results) {

        if (error) {
            res.status(500).send({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: getUsers :' + error);

        } else if (results.length > 0 || results.length == 0) {


            for(var i = 0 ; i < results.length ; i++){

                var project_list = "";
                var jsonObject = JSON.parse(results[i].project);

                for(var j = 0 ; j < jsonObject.length ; j++){
                    project_list += jsonObject[j].label ;
                    if(j != jsonObject.length-1)
                        project_list += ", ";
                }

                results[i].project_list = project_list ;
            }

            res.status(200).send({
                status_messages: 'getUsers success.',
                data : results
            });
        }
        else {
            res.status(404).send({
                status_messages: 'getUsers Not found.',
                status_code: 404
            })
        }
    });
}

function addUser(req, res){
    console.log(req.body.project[0].value);
    var user_field = ['name', 'title', 'phone', 'project', 'email', 'password'];
    var msg = 'Please enter a ';
    var index = 0;  //記欄位index
    var count = 0;  //計算缺了幾個

    var data_set = {
        name : req.body.name,
        title : req.body.title,
        phone : req.body.phone,
        project : req.body.project,
        email : req.body.email,
        password : req.body.password
    };

    /*name title phone...的防呆*/
    for(x in data_set){
        if (data_set[x]==null || data_set[x]=='') {
            if(count!=0)
                msg += ', ';
            msg += user_field[index];
            count++;
        }
        index++;
    }
    if(count != 0){ //少欄位
        res.status(400).send({
            status_messages: msg,
            status_code: 400
        });
        return;
    }

    if(isEmail(data_set['email']) == false){    //判斷email格式
        res.status(400).send({
            status_messages: 'Not a valid e-mail address!',
            status_code: 400
        });
        return;
    }

    var queryStatement = 'INSERT INTO user SET ?' ;

    database.query(queryStatement, data_set, function(error, results) {

        if (error) {
            res.status(500).send({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: addUser :' + error);

        } else {

            res.status(200).send({
                status_messages: 'addUser success.'
            });

        }
    });
}

function isEmail(strEmail) {
    if (strEmail.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1)
        return true;
    return false;
}

function updateUser(req, res){
    var user_field = ['name', 'phone', 'project', 'password'];
    var msg = 'Please enter a ';
    var index = 0;  //記欄位index
    var count = 0;  //計算缺了幾個

    var data_set = {
        name : req.body.name,
        phone : req.body.phone,
        project : req.body.project,
        password : req.body.password
    };

    for(x in data_set){
        if (data_set[x]==null || data_set[x]=='') {
        if(count!=0)
            msg += ', ';
            msg += user_field[index];
                count++;
        }
        index++;
    }

    if(count != 0){
        res.send({
            status_messages: msg,
            status_code: 400
        });
        return;
    }

    if(isEmail(req.body.email) == false){
        res.status(400).send({
            status_messages: 'Not a valid e-mail address!',
            status_code: 400
        });
        return;
    }

    var queryStatement = 'UPDATE user SET ? WHERE email=?;'
    database.query(queryStatement, [data_set, req.body.email], function(error, results) {
        if (error) {
            res.status(500).send({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: updateUserInfo :' + error);

        }else if(results["changedRows"] == 0){
            res.status(404).send({
                status_messages: 'updateUserInfo Not found.'
            });

        }
        else {
            res.status(200).send({
                status_messages: 'updateUserInfo success.'
            });
        }
    });
}

function login(req, res){

    var queryStatement = 'Select id, title, name From user WHERE email=? AND password=?' ;

    database.query(queryStatement, [req.body.email, req.body.password], function(error, results) {

        if (error) {
            res.status(500).send({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: login :' + error);

        } else if (results.length > 0) {

            res.status(200).send({
                status_messages: 'login success.',
                results
            });
        }
        else {
            res.status(401).send({
                status_messages: 'login failed.',
                status_code: 401
            });
        }
    });
}

module.exports.getUsers = getUsers;
module.exports.addUser = addUser;
module.exports.updateUser = updateUser;
module.exports.login = login;
