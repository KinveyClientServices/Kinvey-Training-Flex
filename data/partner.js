const sql = require('mssql')

const config = {
    user: 'training',
    password: 'kinveysql',
    server: 'training-sqlsv.cbefmmhfdivt.us-east-1.rds.amazonaws.com',
    database: 'training',
 
    options: {
    }
}

const pool = new sql.ConnectionPool(config, err => {
	if(err) {
		console.error(err);
	}
})


module.exports.getAll = function(context, complete, modules) {
	pool.request().query('select * from partner').then(result => {
        console.dir(result)
        sql.close()
        //TODO: translate response body fields
        return complete().setBody(result.recordset).ok().done()
    }).catch(err => {
        console.error(err)
        sql.close()
        return complete().setBody(err).runtimeError().done()
    })
}

module.exports.FullPartnerSP = function(context, complete, modules) {
	pool.request().execute('GetFullPartnerInfo').then(result => {
        console.dir(result)
        sql.close()
        //TODO: translate response body fields
        return complete().setBody(result.recordset).ok().done()
    }).catch(err => {
        console.error(err)
        sql.close()
        return complete().setBody(err).runtimeError().done()
    })
}