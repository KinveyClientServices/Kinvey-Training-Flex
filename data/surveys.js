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
};

//TODO: Map result from MySQL to JSON that is in the Kinvey format
function mapRowMysqlToKinvey(row) {
}