'use strict';

class ErrorResponse {
    constructor(status, msg, err) {
        this.status = status;
        this.message = msg;
        if (err) this.error = err;
    }
}

module.exports = ErrorResponse;