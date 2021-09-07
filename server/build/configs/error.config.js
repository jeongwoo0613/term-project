"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.errorLogger = void 0;
const joi_1 = require("joi");
const errorLogger = (err, req, res, next) => {
    console.log(err);
    next(err);
};
exports.errorLogger = errorLogger;
const errorHandler = (err, req, res, next) => {
    const errorStatusCode = err instanceof joi_1.ValidationError ? 400 : err.status || 500;
    const errorMessage = err.message || "Internal Server Error";
    res.status(errorStatusCode).json({
        code: errorStatusCode,
        error: errorMessage,
    });
};
exports.errorHandler = errorHandler;
