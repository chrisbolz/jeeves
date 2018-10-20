const ErrorResponse = require('../../model/ErrorResponse');

module.exports = (res, message, code, err) => {
    console.error(message);
    if (err) console.error(err);
    res.status(code).json(new ErrorResponse(code, message, err));
};