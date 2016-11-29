var mysql = require('mysql');

var database = mysql.createConnection({
	host: '140.124.183.89',
	user: 'its',
	password: '0000',
	database: 'its'
});

//確認有連上server
database.connect(function(err) {
    if (err) {
    	console.error('error connecting: ' + err.stack);
    	return;
    }else{
    	console.log('connect database success') ;
    }
});

module.exports = database;
