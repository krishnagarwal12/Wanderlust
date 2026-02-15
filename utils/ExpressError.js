class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message); // ✅ PASS MESSAGE HERE
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;
