const moment = require('moment');
const randomstring = require('randomstring');

module.exports.savedata = function(context, complete, modules) {
	console.log("echo context: " + JSON.stringify(context));
	const options = {
		useBl: true,
		useUserContext: true
	}
	const store = modules.dataStore(options).collection('Todo');
	const todo = {
		"_id": "57186771a8b943fd316fffff",
		"action": randomstring.generate(7),
		"duedate": moment(),
		"completed":false
	}
	var entity = modules.kinveyEntity.entity(todo)
	entity._id = "57186771a8b943fd316fffff"

	console.log("saving entity: " + JSON.stringify(entity));
	store.save(entity, function(err, result) {
		if(err) {
			return complete().setBody(err).runtimeError().done()
		}
		return complete().setBody(result).ok().next()
	})
}
