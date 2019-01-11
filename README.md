 Kinvey FlexServices Training

[FlexServices](https://devcenter.kinvey.com/html5/guides/flex-services) are microservices that can be used for data integrations or business logic within the [Kinvey mBaas](https://www.kinvey.com/). There are three types of FlexServices:

* **FlexData** for data integrations.
* **FlexAuth** for authentication integrations.
* **FlexFunctions** for business logic (along the lines of what is often called _serverless_). These can be used as custom endpoints, which can be called directly via REST or the Kinvey SDK, or can be added as business logic during the [collection hook pipeline](https://devcenter.kinvey.com/html5/reference/business-logic/reference.html#CollectionHookPipeline).


To use this Flex service, clone this GitHub repository, and install the associated dependencies:

```npm install```

```npm install -g kinvey-cli```

## Using the Flex Services locally

```
ngrok http 10001
node .
```

## Deploying the Flex Services to the cloud

To use each service, you'll have to add a new service within the service catalog on your Kinvey console. 

 Assuming you have already authenticated within the Kinvey CLI, you can run `kinvey flex init` to configure the service to connect it to the service that you created in the console (the CLI will walk you through the steps). Once this is complete, you can use `kinvey flex deploy` to deploy the service to the Kinvey Flex runtime.
