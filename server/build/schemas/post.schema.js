"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const postSchema = joi_1.default.object({
    title: joi_1.default.string().min(1).max(30).required(),
    content: joi_1.default.string().min(1).max(300).required(),
    rise: joi_1.default.boolean().required(),
    fall: joi_1.default.boolean().required(),
});
exports.postSchema = postSchema;
