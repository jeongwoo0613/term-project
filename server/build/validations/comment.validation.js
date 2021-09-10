"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateComment = void 0;
const joi_1 = __importDefault(require("joi"));
const validateComment = async (req, res, next) => {
    try {
        const commentSchema = joi_1.default.object({
            content: joi_1.default.string().min(1).max(150).required(),
        });
        const value = await commentSchema.validateAsync(req.body);
        req.body = value;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validateComment = validateComment;
