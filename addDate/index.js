const sdk = require("kinvey-flex-sdk");
var moment = require('moment');


sdk.service((err, flex) => {

    const functions = flex.functions;

    functions.register("formatDateBL", formatDateBLFunction);

    function formatDateBLFunction(context, complete, modules) {
        console.log(context)

        let promises = context.body.map(history => {

            history.date = moment(history.date).format("dddd, MMMM Do YYYY");

            return history;
    
        })

        Promise.all(promises)
        .then(res => complete().setBody(res).ok().next())
        .catch(err => console.log(err))


    };

});
