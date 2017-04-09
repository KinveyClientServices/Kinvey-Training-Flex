const mysql = require('mysql');

//Connection information to Kinvey Training MySQL Database
const mysqlConnectionInfo = {
	"host" : "training-mysql.cbefmmhfdivt.us-east-1.rds.amazonaws.com",
	"user" : "training",
	"password" : "kinveysql",
	"database" : "training"
};

//TODO: Create a function to handle the getAll endpoint
module.exports.getAll = function(context, complete, modules) {
	var query = "SELECT * FROM surveys;";
	const connection = mysql.createConnection(mysqlConnectionInfo);
	connection.connect(function(err) {
        if (err) {
          console.error('error connecting: ' + err.stack);
          return complete().setBody(err).runtimeError().next();
        } 
		console.log('connected as id ' + connection.threadId);
		connection.query({sql: query}, function (err, rows) {
	        if (err) {
	          console.error('error executing: ' + err.stack);
	          return complete().setBody(err).runtimeError().next();
	        } else {
	          console.log("results: " + JSON.stringify(rows));
	          rows.forEach(function(row) {
		        row = mapRowMysqlToKinvey(row);
		      });
		      return complete().setBody(rows).ok().next();
	        }
      	});
  	});
};

//TODO: Map result from MySQL to JSON that is in the Kinvey format
function mapRowMysqlToKinvey(row) {
    row._id = row.Id;
    delete row.Id;
    row._kmd = {
      ect: row.created_time,
      lmt: row.last_modified_time
    }
    delete row.created_time;
    delete row.last_modified_time;
	row._acl = {};
    return row;
}