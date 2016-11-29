/* use database module */
var database = require('./database');

function getUsers(req, res){

    var queryStatement = 'Select * From user' ;

    database.query(queryStatement, function(error, results) {

        if (error) {
            res.status(500).send({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: getUsers :' + error);

        } else if (results.length > 0) {

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


module.exports.getUsers = getUsers;