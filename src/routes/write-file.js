const fs = require('fs');
const path = require('path');
const sendError = require('./send-error');

module.exports = (req, res, next) => {
    fs.open(req.filePath, 'w', err => {
        if (err) {
            sendError(res, `${err.code === 'ENOENT' ? 'Could not find' : 'Not allowed to write '} file ${req.filePath}`, 404, err);
        } else {
            fs.writeFile(req.filePath, JSON.stringify(req.file, null, 2), err => {
                if (err) {
                    sendError(res, `Error writing file ${req.filePath}`, 500, err);
                } else {
                    next();
                }
            });
        }
    });
};