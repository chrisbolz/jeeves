const express = require('express');
const router = express.Router();

const loadFile = require('./routes/load-file');
const resolveDelete = require('./routes/resolve-delete');
const resolveGet = require('./routes/resolve-get');
const resolvePatch = require('./routes/resolve-patch');
const resolvePost = require('./routes/resolve-post');
const resolvePut = require('./routes/resolve-put');
const resolveQuery = require('./routes/resolve-query');
const resolveRequest = require('./routes/resolve-request');
const sendAnswer = require('./routes/send-answer');
const writeFile = require('./routes/write-file');

router.get('/favicon.ico', (req, res) => res.sendStatus(204));
router.delete('/:query', resolveRequest, loadFile, resolveQuery, resolveDelete, writeFile, sendAnswer);
router.get('/:query', resolveRequest, loadFile, resolveQuery, resolveGet, sendAnswer);
router.patch('/:query', resolveRequest, loadFile, resolveQuery, resolvePatch, writeFile, sendAnswer);
router.post('/:query', resolveRequest, loadFile, resolveQuery, resolvePost, writeFile, sendAnswer);
router.put('/:query', resolveRequest, loadFile, resolveQuery, resolvePut, writeFile, sendAnswer);

module.exports = router;