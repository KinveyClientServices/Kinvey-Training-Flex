const Promise = require('bluebird')
const moment = require('moment')

module.exports.migrate = function(context, complete, modules) {
  const userId = modules.requestContext.getAuthenticatedUserId()

  const options = {
    useBl: false,
    useUserContext: false
  }
  const dataStore = modules.dataStore(options)
  const offline = dataStore.collection("CompressorOfflineEvents")
  const online = dataStore.collection("CompressorOnlineEvents")
  Promise.promisifyAll(offline)
  Promise.promisifyAll(online)

  online.findAsync().then(function(results) {
    var promises = []
    results.forEach(function(onlineEntity) {
      const timeSplits = onlineEntity.last_updated.split(/ |:/)
      onlineEntity._kmd.lmt = moment(timeSplits[0]).add(timeSplits[1], "hours").add(timeSplits[2], "minutes")
      onlineEntity._kmd.ect = onlineEntity._kmd.lmt
      onlineEntity._acl = {"creator": userId}
      delete onlineEntity.last_updated
      promises.push(online.saveAsync(onlineEntity))

      const offlineEntity = {
        "_id": onlineEntity._id,
        "_kmd": onlineEntity._kmd,
        "_acl": onlineEntity._acl,
        "operational_code": onlineEntity.operational_code,
        "start_time": onlineEntity.start_time,
        "end_time": onlineEntity.end_time,
        "equip_id": onlineEntity.equip_id,
        "downtime_code_id": onlineEntity.downtime_code_id
      }
      promises.push(offline.saveAsync(offlineEntity))
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