const path = require('path');
const _ = require('lodash');
const sendError = require('./send-error');

module.exports = (req, res, next) => {
    const fullQuery = req.params.query.split('.');
    req.fileName = _.first(fullQuery);
    req.filePath = path.resolve(__dirname, process.env.test ? '../../test/testData' : '../../files', req.fileName + '.json');
    req.wholeFile = fullQuery.length === 1;

    // Split array[index] into two parts in query.
    req.objectQuery = [];
    const indexMatcher = /\w+\[\d+]/g;
    _.each(_.drop(fullQuery), queryPart => {
        if(_.isArray(queryPart.match(indexMatcher))) {
            req.objectQuery.push(queryPart.substring(0, queryPart.indexOf('[')));
            req.objectQuery.push(queryPart.substring(queryPart.indexOf('[') + 1, queryPart.indexOf(']')))
        } else {
            req.objectQuery.push(queryPart)
        }
    });

    next();
};