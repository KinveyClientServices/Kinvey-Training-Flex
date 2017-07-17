const Promise = require('bluebird')

module.exports.getById = function(context, complete, modules) {
	const options = {
		useBl: true,
		useUserContext: false
	}
	const loansCollection = modules.dataStore(options).collection('loan');
	const accountsCollection = modules.dataStore(options).collection('Accounts');

	const loansCollectionGetByIdAsync = Promise.promisify(loansCollection.findById, { context: loansCollection })
	const accountsCollectionGetByIdAsync = Promise.promisify(accountsCollection.findById, { context: loansCollection })

	var loanInfo
	var accountInfo
	return loansCollectionGetByIdAsync(context.entityId).then(results => {
		console.dir("loans raw response: " + JSON.stringify(results))
        loanInfo = results[0]
        return accountsCollectionGetByIdAsync(context.entityId)
    }).then(results => {
    	console.dir("accounts raw response: " + JSON.stringify(results))
		accountInfo = results
        // TODO merge account + loan
        const contractInformation = Object.assign(accountInfo, loanInfo)
        return complete().setBody(contractInformation).ok().next()
	}).catch(err => {
		console.error(err)
		return complete().setBody(err).runtimeError().done()
	})
}