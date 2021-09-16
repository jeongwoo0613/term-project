import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { Coin } from "../entities/coin.entity";
import { getUpbitCoinPrice } from "../utils/upbit.util";

const createCoin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      return next(createHttpError(400, "could not upload file."));
    }

    const { location, key } = req.file;
    const {
      name,
      symbol,
      description,
      supplyLimit,
      homepage,
      author,
      github,
      whitepaper,
      initialRelease,
      market,
    } = req.body;

    const upbitCoinPrice = await getUpbitCoinPrice(market);

    if (!upbitCoinPrice) {
      return next(createHttpError(400, "could not get upbit coin price"));
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

    const coin = new Coin();
    coin.name = name;
    coin.symbol = symbol;
    coin.description = description;
    coin.market = market;
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
    coin.supplyLimit = supplyLimit;
    coin.homepage = homepage;
    coin.author = author;
    coin.github = github;
    coin.whitepaper = whitepaper;
    coin.initialRelease = initialRelease;
    coin.image = location;
    coin.imageKey = key;

    await getRepository(Coin).insert(coin);

    res.status(201).json({
      message: "succeed.",
    });
  } catch (error) {
    next(createHttpError(400, "coin already exist."));
  }
};

const updateCoin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.coin;

    await getRepository(Coin).update(id, {
      ...req.body,
    });

    res.status(200).json({
      message: "succeed.",
    });
  } catch (error) {
    next(createHttpError(400, "could not update coin."));
  }
};

export { createCoin, updateCoin };
