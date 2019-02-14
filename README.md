 Kinvey FlexServices Training

[FlexServices](https://devcenter.kinvey.com/html5/guides/flex-services) are microservices that can be used for data integrations or business logic within the [Kinvey mBaas](https://www.kinvey.com/). There are three types of FlexServices:

* **FlexData** for data integrations.
* **FlexAuth** for authentication integrations.
* **FlexFunctions** for business logic (along the lines of what is often called _serverless_). These can be used as custom endpoints, which can be called directly via REST or the Kinvey SDK, or can be added as business logic during the [collection hook pipeline](https://devcenter.kinvey.com/html5/reference/business-logic/reference.html#CollectionHookPipeline).



Assuming you have Node.js installed, the first thing we need to do to work with FlexServices is to install the Kinvey CLI. This can be installed globally via npm.

```npm install -g kinvey-cli```
You can see the full list of Kinvey CLI commands by entering:

```kinvey flex -h```

Creating a New Project
FlexServices are all built using JavaScript and Node.js. Here are the steps to start a new project:

Initialize the project using npm.

```npm init```

This asks a series of questions before generating the package.json—the defaults are fine, but feel free to put whatever you like or run npm init -y in order to use the defaults without being prompted.

Install the latest version of the Flex SDK and add it to your package.json with the --save modifier.

```npm install kinvey-flex-sdk --save```

Create the index.js file—this will be the entry point to your FlexService. Add the following code:

```
const sdk = require('kinvey-flex-sdk');
sdk.service((err, flex) => { });
```

Write a function. Let's start simple. This function just sends back what was entered in the request body.

```
const sdk = require("kinvey-flex-sdk");

sdk.service((err, flex) => {

    const functions = flex.functions;

    //Register the function.
    functions.register("echo", echoFunction);
    
    function echoFunction(context, complete, modules) {
        console.log("echo context: " + JSON.stringify(context));
        return complete().setBody(context.body).ok().next();
    }
});
