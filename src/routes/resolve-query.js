const _ = require('lodash');
const Selector = require('../../model/Selector');

module.exports = (req, res, next) => {
    const selectorMatcher = /\w+[=*^$]=\w+/g;

    // Check if any query part contains a selector, save selector result in req.entries.
    if (_.some(req.objectQuery, queryPart => _.isArray(queryPart.match(selectorMatcher)))) {

        // Always use last query part as selector for now.
        const lastQueryPart = _.last(req.objectQuery);

        if (!_.isArray(lastQueryPart.match(selectorMatcher))) {
            res.status(400).send();
        }

        req.objectQuery[req.objectQuery.length - 1] = lastQueryPart.substring(0, lastQueryPart.indexOf('['));
        req.entries = _.filter(_.get(req.file, req.objectQuery), entry => new Selector(lastQueryPart).compare(entry));
    }

    //TODO: WIP for selector not as last query part.
    _.each(req.objectQuery, (queryPart, index) => {
        if(_.isArray(queryPart.match(selectorMatcher))) {
            let selector  = new Selector(queryPart);
            req.objectQuery[index] = selector.arr;
        }
    });

    next();
};