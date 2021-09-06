"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.errorLogger = void 0;
const errorLogger = (err, req, res, next) => {
    console.log(err);
    next(err);
};
exports.errorLogger = errorLogger;
const errorHandler = (err, req, res, next) => {
    const errorStatusCode = err.status || 500;
    const errorMessage = err.message || "Internal Server Error";
    res.status(errorStatusCode).json({
        code: errorStatusCode,
        error: errorMessage,
    });
};
exports.errorHandler = errorHandler;
