//TODO: Create a basic preFetch BL hook to log out the request context
//More advanced use cases can be defined and created on a case by case basis
module.exports.preFetch = function(context, complete, modules) {
	console.log("Survey preFetch context: " + JSON.stringify(context));
	return complete().ok().next();
}