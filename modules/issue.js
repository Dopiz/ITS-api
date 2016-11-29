/* use database module */
var database = require('./database');

function getIssues(req, res){

    var queryStatement = 'Select * From issue' ;

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


module.exports.getIssues = getIssues;
