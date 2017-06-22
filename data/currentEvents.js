const rp = require('request-promise')

module.exports.getAll = function(context, complete, modules) {
    var options = {
        method: 'GET',
        uri: 'https://jsonplaceholder.typicode.com/posts',
        json: true
    };

    rp(options).then(response => {
        console.dir(response.length)
        return complete().setBody(response).ok().done()
    }).catch(err => {
        console.error(err)
        return complete().setBody(err).runtimeError().done()
    })
}
