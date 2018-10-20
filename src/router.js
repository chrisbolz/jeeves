const resolveRequest = require('./routes/resolve-request');
const loadFile = require('./routes/load-file');
const resolveQuery = require('./routes/resolve-query');
const resolveDelete = require('./routes/resolve-delete');
const resolveGet = require('./routes/resolve-get');
const resolvePatch = require('./routes/resolve-patch');
const resolvePost = require('./routes/resolve-post');
const resolvePut = require('./routes/resolve-put');
const writeFile = require('./routes/write-file');
const sendAnswer = require('./routes/send-answer');

module.exports = app => {
    // Return nothing when a browser requests favicon.
    app.get('/favicon.ico', (req, res) => res.sendStatus(204));
    app.delete('/:query', resolveRequest, loadFile, resolveQuery, resolveDelete, writeFile, sendAnswer);
    app.get('/:query', resolveRequest, loadFile, resolveQuery, resolveGet, sendAnswer);
    app.patch('/:query', resolveRequest, loadFile, resolveQuery, resolvePatch, writeFile, sendAnswer);
    app.post('/:query', resolveRequest, loadFile, resolveQuery, resolvePost, writeFile, sendAnswer);
    app.put('/:query', resolveRequest, loadFile, resolveQuery, resolvePut, writeFile, sendAnswer);
};