"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSignup = void 0;
const joi_1 = __importDefault(require("joi"));
const validateSignup = async (req, res, next) => {
    try {
        const signupSchema = joi_1.default.object({
            userId: joi_1.default.string()
                .pattern(/^[a-z0-9]+$/)
                .min(4)
                .max(16)
                .required(),
            password: joi_1.default.string()
                .pattern(/(?=.*[0-9])(?=.*[a-z])(?=.*[^0-9a-zA-Z])/)
                .required(),
            nickname: joi_1.default.string().min(1).max(30).required(),
        });
        const value = await signupSchema.validateAsync(req.body);
        req.body = value;
        next();
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};
exports.validateSignup = validateSignup;
