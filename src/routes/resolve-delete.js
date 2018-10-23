const _ = require('lodash');

module.exports = (req, res, next) => {
    if (req.wholeFile) {
        res.status(405).send();
    } else {
        if (req.entries) {
            _.set(req.file, req.objectQuery, _.differenceWith(_.get(req.file, req.objectQuery), req.entries, _.isEqual));
        } else {
            _.unset(req.file, req.objectQuery);
        }
    }
    res.statusCode = 204;
    next();
};