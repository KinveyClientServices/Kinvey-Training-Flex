module.exports.postFetch = function(context, complete, modules) {
	if(Array.isArray(context.body)) {
		context.body.forEach(function(element) {
			element.resolved = false
		})
	} else {
		context.body.resolved = false
	}
	return complete().ok().next()
}

module.exports.preSave = function(context, complete, modules) {
	console.log("currentEvents preSave context: " + JSON.stringify(context))
	if(context.body.resolved) {
		const pastEvents = modules.dataStore().collection('PastEvents')
		var pastEvent = context.body
		pastEvent._id = context.entityId
		pastEvents.save(context.body, (err, result) => {
			if(err) {
				console.error(err)
				return complete().setBody(err).runtimeError().done()
			}
			console.log("saved event as past event _id: " + context.entityId)
			const currentEvents = modules.dataStore().collection('CurrentEvents')
			currentEvents.removeById(context.entityId, (err, result) => {
				if(err) {
					console.error(err)
					return complete().setBody(err).runtimeError().done()
				}
				console.log("deleted resolved event _id: " + context.body._id)
				return complete().ok().done()
			})
		})
	} else {
		delete context.body.resolved
		return complete().ok().next()
	}
}