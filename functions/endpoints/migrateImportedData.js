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

  importCollection.findAsync().then(function(results) {
    var promises = []
    results.forEach(function(entity) {
      if(collectionName == "CompressorEvents") {
        const timeSplits = entity.last_updated.split(/ |:/)
        entity._kmd.lmt = moment(timeSplits[0]).add(timeSplits[1], "hours").add(timeSplits[2], "minutes")
        entity._kmd.ect = entity._kmd.lmt
        entity._acl = {"creator": userId}
        delete entity.last_updated
      }

      promises.push(targetCollection.saveAsync(entity))
    });
    return Promise.all(promises)
  }).then(function(results) {
    console.log("finished update of record count: " + results.length);
    return complete().setBody("finished update").ok().done()
  }).catch(function(err) {
    console.error(err)
    return complete().setBody(err).runtimeError().done()
  })
}