const postgres = require('pg');
const moment = require('moment');

//Connection information to Standard Demo Environment Postrgres Database
const postgresConnectionInfo = {
	"host" : "postgres.cbefmmhfdivt.us-east-1.rds.amazonaws.com",
	"user" : "sde",
	"password" : "google1#",
	"database" : "toyota"
};

const pool = new postgres.Pool(postgresConnectionInfo)

module.exports.getAll = function(context, complete, modules) {
	var query = "SELECT * FROM loans;";
	pool.query(query, function (err, results) {
        if (err) {
			console.error('error executing: ' + err.stack);
			return complete().setBody(err).runtimeError().next();
        } else {
        	console.log("results: " + JSON.stringify(results));
    		const rows = results.rows
			rows.forEach(function(row) {
			row = mapRowPostgresToKinvey(row);
			});
			return complete().setBody(rows).ok().next();
        }
  	});
};

module.exports.getById = function(context, complete, modules) {
	var query = "SELECT * FROM loans WHERE account_number = " + context.entityId + ";";
	pool.query(query, function (err, results) {
        if (err) {
			console.error('error executing: ' + err.stack);
			return complete().setBody(err).runtimeError().next();
		} else {
			console.log("results: " + JSON.stringify(results));
			const rows = results.rows
			rows.forEach(function(row) {
			row = mapRowPostgresToKinvey(row);
		});
		return complete().setBody(rows).ok().next();
        }
  	});
};

function mapRowPostgresToKinvey(row) {
    row._id = row.account_number;
    delete row.account_number;
    row._kmd = {
      ect: moment(),
      lmt: moment()
    }
	row._acl = {};
    return row;
}