//TODO: include the Kinvey Flex SDK
const sdk = require("kinvey-flex-sdk");
const packageJson = require('./package.json');
//TODO: Breakout specific logic out into its own folders and include here
const auth = require("./auth/auth.js");
const surveysIntegration = require("./data/surveys.js");
const surveysFunctions = require("./functions/collections/surveysFunctions.js");
const brokenCustomEndpoint = require("./functions/endpoints/broken.js");
const saveDataEndpoint = require("./functions/endpoints/savedata.js");
const echoCustomEndpoint = require("./functions/endpoints/echo.js");

//TODO: Declare the Flex Service
const service = sdk.service(function(err, flex) {
	console.log("flex metadata: " + JSON.stringify(flex));
	console.log("service version: " + packageJson.version);
	//TODO: Declare the 3 main flex components
	const flexAuth = flex.auth;
	const flexData = flex.data;
	const flexFunctions = flex.functions;

	//TODO: Register a function to handle authentication
	const trainingAuth = flexAuth.register("dummyAuth", auth.dummyAuth);

	//TODO: Define the top level service object. This will be the API entry point for a collection for all CRUD methods.
	const surveys = flexData.serviceObject("Surveys");
	//TODO: Register a handler for get all: GET /:serviceobject
	surveys.onGetAll(surveysIntegration.getAll);

	//TODO: Register a handler for a preFetch Business Logic hook
	const surveysPreFetch = flexFunctions.register("surveysPreFetch", surveysFunctions.preFetch);

	//TODO: Register handlers for custom endpoints
	const brokenEndpoint = flexFunctions.register("broken", brokenCustomEndpoint.broken);
	const brokenTimeoutEndpoint = flexFunctions.register("brokenTimeout", brokenCustomEndpoint.brokenTimeout);
	const savedata = flexFunctions.register("savedata", saveDataEndpoint.savedata)
	const echoEndpoint = flexFunctions.register("echo", echoCustomEndpoint.echo);
})
