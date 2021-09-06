"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePost = void 0;
const joi_1 = __importDefault(require("joi"));
const validatePost = async (req, res, next) => {
    try {
        const postSchema = joi_1.default.object({
            title: joi_1.default.string().min(1).max(30).required(),
            content: joi_1.default.string().min(1).max(300).required(),
            rise: joi_1.default.boolean().required(),
            fall: joi_1.default.boolean().required(),
        });
        const value = await postSchema.validateAsync(req.body);
        req.body = value;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validatePost = validatePost;
