const _ = require('lodash');

module.exports = (req, res, next) => {
    if (req.wholeFile) {
        req.answer = req.file;
    } else {
        req.answer = req.entries? req.entries : _.get(req.file, req.objectQuery);
    }
    res.statusCode = 200;
    next();
};