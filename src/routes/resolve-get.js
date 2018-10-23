const _ = require('lodash');

module.exports = (req, res, next) => {
    req.answer = req.wholeFile ? req.file : req.entries ? req.entries : _.get(req.file, req.objectQuery);
    res.statusCode = 200;
    next();
};