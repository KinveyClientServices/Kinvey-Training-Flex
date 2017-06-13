module.exports.newDowntimeEvent = function(context, complete, modules) {
	console.log("new newDowntimeEvent executed: " + JSON.stringify(context))
	const msg = context.body.name + "went offline at" + context.body.time
	modules.push.broadcastMessage(msg, (err, result) => {
		if(err) {
			console.error(err)
			return complete().setBody(err).runtimeError().done()
		}
		return complete().setBody({result: "success"}).ok().done()
	})
}