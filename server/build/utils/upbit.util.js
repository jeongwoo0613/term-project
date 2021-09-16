"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpbitCoinPrice = exports.getUpbitCoinsPrice = void 0;
const axios_1 = __importDefault(require("axios"));
const instance = axios_1.default.create({
    baseURL: "https://api.upbit.com/v1",
});
const getUpbitCoinsPrice = async (coins) => {
    try {
        const upbitCoinsPrice = await Promise.all(coins.reduce((acc, coin) => {
            acc.push(instance.get("/ticker", { params: { markets: coin.market } }));
            return acc;
        }, []));
        return upbitCoinsPrice.reduce((acc, coin, i) => {
            acc[coins[i].symbol] = coin.data;
            return acc;
        }, {});
    }
    catch (error) {
        console.log(error);
    }
};
exports.getUpbitCoinsPrice = getUpbitCoinsPrice;
const getUpbitCoinPrice = async (market) => {
    try {
        const result = await instance.get("/ticker", {
            params: { markets: market },
        });
        return result.data;
    }
    catch (error) {
        console.log(error);
    }
};
exports.getUpbitCoinPrice = getUpbitCoinPrice;
