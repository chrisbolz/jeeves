const _ = require('lodash');

module.exports = (req, res, next) => {
    if (req.wholeFile) {
        res.status(400).send();
    } else {
        if (req.entries) {
            res.status(405).send();
        } else {
            if(_.get(req.file, req.objectQuery) == null) {
                _.set(req.file, req.objectQuery, req.body);
            } else {
                if(_.isArray(_.get(req.file, req.objectQuery))) {
                    req.file[req.objectQuery.join('.')].push(req.body);
                } else {
                    res.status(400).send();
                }
            }
        }
    }
    res.statusCode = 201;
    next();
};