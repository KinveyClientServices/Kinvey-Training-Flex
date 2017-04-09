//TODO: include the Kinvey Flex SDK
//TODO: Breakout specific logic out into its own folders and include here
const auth = require("./auth/auth.js");
const surveysIntegration = require("./data/surveys.js");
const surveysFunctions = require("./functions/collections/surveysFunctions.js");
const brokenCustomEndpoint = require("./functions/endpoints/broken.js");
const echoCustomEndpoint = require("./functions/endpoints/echo.js");

//TODO: Declare the Flex Service
	//TODO: Declare the 3 main flex components

	//TODO: Register a function to handle authentication

	//TODO: Define the top level service object. This will be the API entry point for a collection for all CRUD methods.

	//TODO: Register a handler for get all: GET /:serviceobject

	//TODO: Register a handler for a preFetch Business Logic hook

	//TODO: Register handlers for custom endpoints