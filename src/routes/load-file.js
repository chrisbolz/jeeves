const fs = require('fs');
const sendError = require('./send-error');

module.exports = (req, res, next) => {
    fs.open(req.filePath, 'r', err => {
        if (err) {
            sendError(res, `${err.code === 'ENOENT' ? 'File not found' : 'Could not open file'}`, 404, err);
        } else {
            fs.readFile(req.filePath, (err, data) => {
                if (err) {
                    sendError(res, `Error reading file ${req.filePath}`, 500, err)
                } else {
                    try {
                        req.file = JSON.parse(data);
                        next();
                    } catch (err) {
                        sendError(res, `Failed to parse ${req.filePath} to JSON`, 500, err);
                    }
                }
            });
        }
    });
};