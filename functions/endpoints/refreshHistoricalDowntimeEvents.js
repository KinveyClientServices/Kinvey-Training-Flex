const Promise = require('bluebird')
const rp = require('request-promise')
const moment = require('moment')

module.exports.refreshHistoricalDowntimeEvents = function(context, complete, modules) {
	const dataStore = modules.dataStore()
	const lastSyncedEventCollection = modules.dataStore().collection('LastSyncedEvent')
	//TODO: update to correct collection
	const pastEventsCollection = modules.dataStore().collection('PastEventsTest')

	//promisified methods
	const lastSyncedEventFindAsync = Promise.promisify(lastSyncedEventCollection.find, { context: lastSyncedEventCollection })
	const lastSyncedEventSaveAsync = Promise.promisify(lastSyncedEventCollection.save, { context: lastSyncedEventCollection })
	const pastEventSaveAsync = Promise.promisify(pastEventsCollection.save, { context: pastEventsCollection })

	var lastSyncedEvent
	//get last sync time
	lastSyncedEventFindAsync().then(lastSyncedEvents => {
		if(lastSyncedEvents.length == 0) {
			throw new Error("No record of last time sync")
		}
		
		lastSyncedEvent = lastSyncedEvents[0]
		return lastSyncedEvents[0].time
	}).then(lastSyncedEventTime => {
		//query by last query time
		//TODO update to actal API by last updated time
	    var options = {
	        method: 'GET',
	        uri: 'https://jsonplaceholder.typicode.com/posts',
	        json: true
	    };

	    return rp(options)
	}).then(newEvents => {
		//save events to Kinvey
        console.dir(newEvents.length)
        const promises = []
        newEvents.forEach(newEvent => {
        	//TODO: translate current fields into past? 
        	promises.push(pastEventSaveAsync(newEvent))
        })
        return Promise.all(promises);
    }).then(results => {
    	//update last sync time with most recent event
    	console.log(JSON.stringify(results))
    	lastSyncedEvent.time = moment()
    	return lastSyncedEventSaveAsync(lastSyncedEvent)
    }).then(updatedLastSyncedEvent => {
    	//exit
    	return complete().setBody(updatedLastSyncedEvent).ok().done()
	}).catch(err => {
		console.error(err)
		return complete().setBody(err).runtimeError().done()
	})
}