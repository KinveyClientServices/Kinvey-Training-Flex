//TODO: include the Kinvey Flex SDK
const sdk = require("kinvey-flex-sdk");
const packageJson = require('./package.json');
//TODO: Breakout specific logic out into its own folders and include here
const auth = require("./auth/auth.js");
const surveysIntegration = require("./data/surveys.js");
const partnerIntegration = require("./data/partner.js");
const downtimeEventIntegration = require("./data/currentEvents.js")
const surveysFunctions = require("./functions/collections/surveysFunctions.js");
const currentEventsFunctions = require("./functions/collections/currentEventsFunctions.js");
const echoCustomEndpoint = require("./functions/endpoints/echo.js");
const migrateCustomEndpoint = require("./functions/endpoints/migrateImportedData.js");
const newDowntimeEventCustomEndpoint = require("./functions/endpoints/newDowntimeEvent.js");
const refreshHistoricalDowntimeEventsCustomEndpoint = require("./functions/endpoints/refreshHistoricalDowntimeEvents.js");

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

	const partner = flexData.serviceObject("Partner");
	partner.onGetAll(partnerIntegration.getAll);
	partner.onGetById(partnerIntegration.getById);
	const fullPartnerSP = flexData.serviceObject("FullPartnerSP");
	fullPartnerSP.onGetAll(partnerIntegration.FullPartnerSP);

	const events = flexData.serviceObject("CurrentEvents")
	events.onGetAll(downtimeEventIntegration.getAll)

	//TODO: Register a handler for a preFetch Business Logic hook
	flexFunctions.register("surveysPreFetch", surveysFunctions.preFetch);
	flexFunctions.register("currentEventsPostFetch", currentEventsFunctions.postFetch);
	flexFunctions.register("currentEventsPreSave", currentEventsFunctions.preSave);

	//TODO: Register handlers for custom endpoints
	flexFunctions.register("echo", echoCustomEndpoint.echo);
	flexFunctions.register("migrate", migrateCustomEndpoint.migrate);
	flexFunctions.register("newDowntimeEvent", newDowntimeEventCustomEndpoint.newDowntimeEvent);
	flexFunctions.register("refreshHistoricalDowntimeEvents", refreshHistoricalDowntimeEventsCustomEndpoint.refreshHistoricalDowntimeEvents);
})
