"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoin = exports.getCoins = exports.coinById = void 0;
const typeorm_1 = require("typeorm");
const coin_entity_1 = require("../entities/coin.entity");
const upbit_util_1 = require("../utils/upbit.util");
const coinById = async (req, res, next, id) => {
    try {
        const coin = await typeorm_1.getRepository(coin_entity_1.Coin).findOne(id);
        if (!coin) {
            return res.status(404).json({
                code: 404,
                error: "coin not found.",
            });
        }
        req.coin = coin;
        next();
    }
    catch (error) {
        res.status(400).json({
            code: 400,
            error: "coin's id don't match.",
        });
    }
};
exports.coinById = coinById;
const getCoins = async (req, res) => {
    try {
        const coinRepository = typeorm_1.getRepository(coin_entity_1.Coin);
        const coins = await coinRepository.find({
            order: {
                accTradePrice24h: "DESC",
            },
            take: 10,
        });
        const upbitCoinsPrice = await upbit_util_1.getUpbitCoinsPrice(coins);
        if (!upbitCoinsPrice) {
            return res.status(200).json(coins);
        }
        for (const coin of coins) {
            const [upbitCoinPrice] = upbitCoinsPrice[coin.symbol];
            const { opening_price, high_price, low_price, trade_price, prev_closing_price, change, acc_trade_price, acc_trade_price_24h, acc_trade_volume, acc_trade_volume_24h, highest_52_week_price, highest_52_week_date, lowest_52_week_price, lowest_52_week_date, } = upbitCoinPrice;
            await coinRepository.update(coin.id, {
                openingPrice: opening_price,
                highPrice: high_price,
                lowPrice: low_price,
                tradePrice: trade_price,
                prevClosingPrice: prev_closing_price,
                change: change,
                accTradePrice: acc_trade_price,
                accTradePrice24h: acc_trade_price_24h,
                accTradeVolume: acc_trade_volume,
                accTradeVolume24h: acc_trade_volume_24h,
                highest52WeekPrice: highest_52_week_price,
                highest52WeekDate: highest_52_week_date,
                lowest52WeekPrice: lowest_52_week_price,
                lowest52WeekDate: lowest_52_week_date,
            });
            coin.openingPrice = opening_price;
            coin.highPrice = high_price;
            coin.lowPrice = low_price;
            coin.tradePrice = trade_price;
            coin.prevClosingPrice = prev_closing_price;
            coin.change = change;
            coin.accTradePrice = acc_trade_price;
            coin.accTradePrice24h = acc_trade_price_24h;
            coin.accTradeVolume = acc_trade_volume;
            coin.accTradeVolume24h = acc_trade_volume_24h;
            coin.highest52WeekPrice = highest_52_week_price;
            coin.highest52WeekDate = highest_52_week_date;
            coin.lowest52WeekPrice = lowest_52_week_price;
            coin.lowest52WeekDate = lowest_52_week_date;
        }
        res.status(200).json(coins);
    }
    catch (error) {
        res.status(400).json({
            code: 400,
            error: "could not load coins",
        });
    }
};
exports.getCoins = getCoins;
const getCoin = async (req, res) => {
    try {
        const { id, market } = req.coin;
        const upbitCoinPrice = await upbit_util_1.getUpbitCoinPrice(market);
        if (!upbitCoinPrice) {
            return res.status(200).json(req.coin);
        }
        const { opening_price, high_price, low_price, trade_price, prev_closing_price, change, acc_trade_price, acc_trade_price_24h, acc_trade_volume, acc_trade_volume_24h, highest_52_week_price, highest_52_week_date, lowest_52_week_price, lowest_52_week_date, } = upbitCoinPrice[0];
        await typeorm_1.getRepository(coin_entity_1.Coin).update(id, {
            openingPrice: opening_price,
            highPrice: high_price,
            lowPrice: low_price,
            tradePrice: trade_price,
            prevClosingPrice: prev_closing_price,
            change: change,
            accTradePrice: acc_trade_price,
            accTradePrice24h: acc_trade_price_24h,
            accTradeVolume: acc_trade_volume,
            accTradeVolume24h: acc_trade_volume_24h,
            highest52WeekPrice: highest_52_week_price,
            highest52WeekDate: highest_52_week_date,
            lowest52WeekPrice: lowest_52_week_price,
            lowest52WeekDate: lowest_52_week_date,
        });
        req.coin.openingPrice = opening_price;
        req.coin.highPrice = high_price;
        req.coin.lowPrice = low_price;
        req.coin.tradePrice = trade_price;
        req.coin.prevClosingPrice = prev_closing_price;
        req.coin.change = change;
        req.coin.accTradePrice = acc_trade_price;
        req.coin.accTradePrice24h = acc_trade_price_24h;
        req.coin.accTradeVolume = acc_trade_volume;
        req.coin.accTradeVolume24h = acc_trade_volume_24h;
        req.coin.highest52WeekPrice = highest_52_week_price;
        req.coin.highest52WeekDate = highest_52_week_date;
        req.coin.lowest52WeekPrice = lowest_52_week_price;
        req.coin.lowest52WeekDate = lowest_52_week_date;
        res.status(200).json(req.coin);
    }
    catch (error) {
        res.status(404).json({
            code: 404,
            error: "could not load coin",
        });
    }
};
exports.getCoin = getCoin;
