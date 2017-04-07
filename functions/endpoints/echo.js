module.exports.echo = function(context, complete, modules) {
  console.log("echo context: " + JSON.stringify(context));
  return complete().setBody(context).ok().next();
}