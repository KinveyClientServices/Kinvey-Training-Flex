//TODO: Create a custom endpoint which echoes the Kinvey request back to the caller for test purposes
module.exports.echo = function(context, complete, modules) {
  console.log("echo context: " + JSON.stringify(context));
  return complete().setBody(context).ok().next();
}