module.exports.postFetch = function(context, complete, modules) {
	console.log("pastEvents postFetch context: " + JSON.stringify(context));
	console.log("pastEvents postFetch complete: " + JSON.stringify(complete));
	if(Array.isArray(context.body)) {
		context.body.forEach(function(element) {
			element.resolved = true
		})
	} else {
		context.body.resolved = true
	}
	return complete().ok().next();
}