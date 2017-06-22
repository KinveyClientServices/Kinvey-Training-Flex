const Promise = require('bluebird')
const moment = require('moment')

module.exports.migrate = function(context, complete, modules) {
  const userId = modules.requestContext.getAuthenticatedUserId()
  const collectionName = context.body.collection

  const options = {
    useBl: true,
    useUserContext: true
  }
  const dataStore = modules.dataStore(options)
  //past events requires master secret to override read only
  const targetCollection = (collectionName == "PastEvents") ? modules.dataStore().collection(collectionName) : dataStore.collection(collectionName)
  const importCollection = dataStore.collection("imported")
  Promise.promisifyAll(targetCollection)
  Promise.promisifyAll(importCollection)

  const uxDowntimeCodeNames = [ "MSD", "CAT Panel SD", "Low STG 2 Discharge Press", "Low Engine Oil Level", "High STG 3 Discharge Press"]
  const uxCompressorNames = ["Pembrook X-1 Unit 1", "Rocker B1 - 102 Unit 1 (2704)", "XBC Giddings Estate"]
  const uxMechanicNames = ["James Hoshor", "Florian Saurs", "Sergio Martinez", "Spurti Gurram"]
  const uxSystemCodes = ["01 Compressor Skid", "02 Suction Skid", "03 Discharge Skid", "04 Fuel Gas System", "05 Dowsntream Infrastructure", "06 Upstream - Battery", "07 Construction", "08 Wells Not In Service", "09 Other"]
  const uxEquipmentCodes = ["01 Dump Line", "02 Dump Valve", "03 Recycle Valve", "04 Instrumentation", "05 Scrubber Level", "06 Other"]
  const knownCompressorNames = {
    "32116":"DL Hutt C 38-11 Unit 1",
    "32131":"ET O Daniel 37-3 Unit 2",
    "32165":"Texas Ten Y 39-40 Unit 1",
    "32166":"Texas Ten Y 39-40 Unit 2"
  }

  const query = new modules.Query();
  if(collectionName == "CurrentEvents") {
    query.limit = 10
  }

  importCollection.findAsync(query).then(function(results) {
    var promises = []
    results.forEach(function(entity) {
      if(collectionName == "CurrentEvents" || collectionName == "PastEvents") {
        //_kmd.lmt
        var timeSplits = entity.last_updated.split(/ |:/)
        entity._kmd.lmt = moment(timeSplits[0]).add(timeSplits[1], "hours").add(timeSplits[2], "minutes")
        entity._kmd.ect = entity._kmd.lmt
        entity._acl = {"creator": userId}
        delete entity.last_updated
        //entity_name
        entity.equipment_name = (knownCompressorNames[entity.equip_id] == null) ? uxCompressorNames[getRandomInt(0, 3)] : knownCompressorNames[entity.equip_id]
        //start_time + end_time
        timeSplits = entity.start_time.split(/ |:/)
        entity.start_time = moment(timeSplits[0]).add(timeSplits[1], "hours").add(timeSplits[2], "minutes")
        timeSplits = entity.end_time.split(/ |:/)
        entity.end_time = moment(timeSplits[0]).add(timeSplits[1], "hours").add(timeSplits[2], "minutes")
        //last_recalculated
        timeSplits = entity.last_recalculated.split(/ |:/)
        entity.last_recalculated = moment(timeSplits[0]).add(timeSplits[1], "hours").add(timeSplits[2], "minutes")
        //downtime_code_name
        entity.downtime_code_name = uxDowntimeCodeNames[getRandomInt(0, 5)]
        //mechanic_name
        entity.mechanic_name = uxMechanicNames[getRandomInt(0,4)]
        //equip_code
        entity.equip_code = uxEquipmentCodes[getRandomInt(0,6)]
        //system_code
        entity.system_code = uxSystemCodes[getRandomInt(0,9)]
        //resolved
        if(collectionName == "PastEvents") {
          entity.last_saved_by = "Patrick Lawrence"
          entity.resolved = true
        }
      }

      promises.push(targetCollection.saveAsync(entity))
    });
    return Promise.all(promises)
  }).then(function(results) {
    console.log("finished update of record count: " + results.length);
    return complete().setBody({"result":"success"}).ok().done()
  }).catch(function(err) {
    console.error(err)
    return complete().setBody(err).runtimeError().done()
  })
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}