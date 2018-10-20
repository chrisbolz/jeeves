const _ = require('lodash');
const mergeDeep = require('merge-deep');

module.exports = (req, res, next) => {
    if (req.wholeFile) {
        req.file = mergeDeep(req.file, req.body);
    } else {
        if (!req.entries) {
            _.set(req.file, req.objectQuery, mergeDeep(_.get(req.file, req.objectQuery), req.body));
        } else {
            if (!_.isArray(_.get(req.file, req.objectQuery))) {
                res.status(400).send();
            }

            let arrayToUpdate = _.get(req.file, req.objectQuery);
            _.each(req.entries, entry => {
                const indexInArray = _.indexOf(arrayToUpdate, entry);
                if (indexInArray !== -1) {
                    arrayToUpdate[indexInArray] = mergeDeep(entry, req.body);
                }
            });

            _.set(req.file, req.objectQuery, arrayToUpdate);
        }
    }
    next();
};