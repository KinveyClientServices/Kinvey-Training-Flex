 Kinvey FlexServices Training

Deploying a FlexService
Now that we know our FlexService works, let's deploy it.

In the Kinvey Console, choose the "Service Catalog" tab at the top of the page and then click the "Add a Service" button on the right hand side of the page.

https://console.kinvey.com

## Using the Flex Services locally

```
ngrok http 10001
node .
```

## Deploying the Flex Services to the cloud

To use each service, you'll have to add a new service within the service catalog on your Kinvey console. 

 Assuming you have already authenticated within the Kinvey CLI, you can run `kinvey flex init` to configure the service to connect it to the service that you created in the console (the CLI will walk you through the steps). Once this is complete, you can use `kinvey flex deploy` to deploy the service to the Kinvey Flex runtime.
