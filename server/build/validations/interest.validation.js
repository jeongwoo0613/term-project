"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInterestCoin = void 0;
const joi_1 = __importDefault(require("joi"));
const validateInterestCoin = async (req, res, next) => {
    try {
        const interestSchema = joi_1.default.object({
            interest: joi_1.default.boolean().required(),
        });
        const value = await interestSchema.validateAsync(req.body);
        req.body = value;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validateInterestCoin = validateInterestCoin;
