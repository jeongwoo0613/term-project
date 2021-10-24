import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Coin, User } from "../entities";
import { getUpbitCoinPrice, getUpbitCoinsPrice } from "../utils";

const coinById = async (
  req: Request,
  res: Response,
  next: NextFunction,
  id: string
): Promise<void> => {
  try {
    const coin = await getRepository(Coin).findOne(id, {
      relations: ["posts"],
    });

    if (!coin) {
      return next(createHttpError(404, "coin not found"));
    }

    req.coin = coin;
    next();
  } catch (error) {
    next(createHttpError(400, "coin's id don't match."));
  }
};

const getCoins = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> => {
  try {
    const coinRepository = getRepository(Coin);

    const coins = await coinRepository.find({
      order: {
        accTradePrice24h: "DESC",
      },
      take: 10,
    });

    const upbitCoinsPrice = await getUpbitCoinsPrice(coins);

    if (!upbitCoinsPrice) {
      return res.status(200).json(coins);
    }

    for (const coin of coins) {
      const upbitCoinPrice = upbitCoinsPrice[coin.symbol];
      const {
        opening_price,
        high_price,
        low_price,
        trade_price,
        prev_closing_price,
        change,
        acc_trade_price,
        acc_trade_price_24h,
        acc_trade_volume,
        acc_trade_volume_24h,
        highest_52_week_price,
        highest_52_week_date,
        lowest_52_week_price,
        lowest_52_week_date,
      } = upbitCoinPrice;

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

    coins.sort((a, b) => b.accTradePrice24h - a.accTradePrice24h);

    res.status(200).json(coins);
  } catch (error) {
    next(createHttpError(400, "could not get coins"));
  }
};

const getCoin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> => {
  try {
    const { id, market } = req.coin;

    const upbitCoinPrice = await getUpbitCoinPrice(market);

    if (!upbitCoinPrice) {
      return res.status(200).json(req.coin);
    }

    const {
      opening_price,
      high_price,
      low_price,
      trade_price,
      prev_closing_price,
      change,
      acc_trade_price,
      acc_trade_price_24h,
      acc_trade_volume,
      acc_trade_volume_24h,
      highest_52_week_price,
      highest_52_week_date,
      lowest_52_week_price,
      lowest_52_week_date,
    } = upbitCoinPrice;

    await getRepository(Coin).update(id, {
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
  } catch (error) {
    next(createHttpError(400, "could not get coin"));
  }
};

const addInterestCoin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { interest } = req.body;

    const coin = await getRepository(Coin).findOne(req.coin.id, {
      relations: ["users"],
    });

    if (!coin) {
      return next(createHttpError(400, "coin not found"));
    }

    const checkInterestCoin =
      req.user.interests.some((coin) => coin.id === req.coin.id) &&
      coin.users.some((user) => user.id === req.user.id);

    if (!interest || checkInterestCoin) {
      next(createHttpError(400, "interest coin already exists."));
    }

    req.user.interests.push(req.coin);
    await getRepository(User).save(req.user);

    coin.users.push(req.user);
    await getRepository(Coin).save(coin);

    res.status(200).json({
      message: "succeed.",
    });
  } catch (error) {
    next(createHttpError(400, "could not add interest coin."));
  }
};

const deleteInterestCoin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { interest } = req.body;

    const coin = await getRepository(Coin).findOne(req.coin.id, {
      relations: ["users"],
    });

    if (!coin) {
      return next(createHttpError(400, "coin not found"));
    }

    const checkInterestCoin =
      req.user.interests.some((coin) => coin.id === req.coin.id) &&
      coin.users.some((user) => user.id === req.user.id);

    if (interest || !checkInterestCoin) {
      next(createHttpError(400, "could not find interest coin"));
    }

    req.user.interests = req.user.interests.filter((coin) => {
      return coin.id !== req.coin.id;
    });

    await getRepository(User).save(req.user);

    coin.users = coin.users.filter((user) => {
      return user.id !== req.user.id;
    });

    await getRepository(Coin).save(req.coin);

    res.status(200).json({
      message: "succeed.",
    });
  } catch (error) {
    next(createHttpError(400, "could not delete interest coin."));
  }
};

export { coinById, getCoins, getCoin, addInterestCoin, deleteInterestCoin };
