module.exports.postFetch = function(context, complete, modules) {
	console.log("currentEvents postFetch context: " + JSON.stringify(context));
	if(Array.isArray(context.body)) {
		context.body.forEach(function(element) {
			element.resolved = false
		})
	} else {
		context.body.resolved = false
	}
	return complete().ok().next();
}