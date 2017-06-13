const Promise = require('bluebird')
const moment = require('moment')

module.exports.migrate = function(context, complete, modules) {
  const userId = modules.requestContext.getAuthenticatedUserId()
  const collectionName = context.body.collection

  const options = {
    useBl: false,
    useUserContext: true
  }
  const dataStore = modules.dataStore(options)
  const targetCollection = dataStore.collection(collectionName)
  const importCollection = dataStore.collection("imported")
  Promise.promisifyAll(targetCollection)
  Promise.promisifyAll(importCollection)

  const uxCompressorNames = ["Pembrook X-1 Unit 1", "Rocker B1 - 102 Unit 1 (2704)", "XBC Giddings Estate"]
  const knownCompressorNames = {
    "32116":"DL Hutt C 38-11 Unit 1",
    "32131":"ET O Daniel 37-3 Unit 2",
    "32165":"Texas Ten Y 39-40 Unit 1",
    "32166":"Texas Ten Y 39-40 Unit 2"
  }


  importCollection.findAsync().then(function(results) {
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