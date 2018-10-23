const _ = require('lodash');

module.exports = (req, res, next) => {
    if (req.wholeFile) {
        req.file = req.body;
    } else {
        if (req.entries) {
            let arrayToUpdate = _.get(req.file, req.objectQuery);
            _.each(req.entries, entry => {
                const indexInArray = _.indexOf(arrayToUpdate, entry);
                if (indexInArray !== -1) {
                    arrayToUpdate[indexInArray] = req.body;
                }
            });
            _.set(req.file, req.objectQuery, arrayToUpdate);
        } else {
            _.set(req.file, req.objectQuery, req.body);
        }
    }
    res.statusCode = 200;
    next();
};