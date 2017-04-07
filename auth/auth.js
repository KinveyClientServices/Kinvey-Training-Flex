module.exports.dummyAuth = function(context, complete, modules) {
	console.log("Authentication Context: " + JSON.stringify(context));
	complete().setToken({"authToken":"sayfriendandenter"}).ok().next();
};