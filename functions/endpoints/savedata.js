const moment = require('moment');
const randomstring = require('randomstring');

module.exports.savedata = function(context, complete, modules) {
	console.log("echo context: " + JSON.stringify(context));
	const options = {
		useBl: true,
		useUserContext: false
	}
	const store = modules.dataStore(options).collection('Todo');
	const todo = {
		"action": randomstring.generate(7),
		"duedate": moment(),
		"completed":false
	}
	var entity = modules.kinveyEntity.entity(todo);
	entity._acl["gw"] = true;

	store.save(entity, function(err, result) {
		if(err) {
			return complete().setBody(err).runtimeError().done();
		}
		return complete().setBody("success").ok().next();
	})
}