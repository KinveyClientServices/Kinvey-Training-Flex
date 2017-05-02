//A broken endpoint which will fail every time to see what log output looks like
module.exports.broken = function(context, complete, modules) {
	try {
		console.log("WILL FAIL INTENTIONALLY - times out to Kinvey after 60 seconds");
	  	console.log("broken syntax: " + JSON.stringify(request.method));
	} catch (err) {
		return complete().setBody({"stuffWentWrong":"heresWhy", "statusCode": 550}).runtimeError().done();
  	}
}

module.exports.brokenTimeout = function(context, complete, modules) {
	console.log("WILL FAIL INTENTIONALLY - times out to Kinvey after 60 seconds");
  	console.log("broken syntax: " + JSON.stringify(request.method));
  	return complete().setBody({"stuffWentWrong":"heresWhy", "statusCode": 550}).runtimeError().done();
}