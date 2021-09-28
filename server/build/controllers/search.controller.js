"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCoin = void 0;
const fuse_js_1 = __importDefault(require("fuse.js"));
const http_errors_1 = __importDefault(require("http-errors"));
const typeorm_1 = require("typeorm");
const coin_entity_1 = require("../entities/coin.entity");
const searchCoin = async (req, res, next) => {
    try {
        const { name } = req.query;
        const coins = await (0, typeorm_1.getRepository)(coin_entity_1.Coin).find();
        const fuse = new fuse_js_1.default(coins, {
            keys: ["name", "symbol"],
        });
        const searchResult = fuse.search(name);
        if (searchResult.length === 0) {
            return next((0, http_errors_1.default)(400, "could not search coin"));
        }
        res.status(200).json(searchResult[0].item);
    }
    catch (error) {
        next((0, http_errors_1.default)(400, "could not search coin"));
    }
};
exports.searchCoin = searchCoin;
