const sdk = require("kinvey-flex-sdk");

sdk.service((err, flex) => {

    const functions = flex.functions;
   
     //register the function to kinvey
    functions.register("echo", echoFunction);

    function echoFunction(context, complete, modules) {
        console.log("echo context: " + JSON.stringify(context));
        return complete().setBody(context.body).ok().next();
    }
});

