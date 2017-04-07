module.exports.preFetch = function(context, complete, modules) {
	console.log("Survey preFetch context: " + JSON.stringify(context));
	return complete().ok().next();
}