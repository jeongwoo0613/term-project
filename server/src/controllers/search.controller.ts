import Fuse from "fuse.js";
import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Coin } from "../entities/coin.entity";

const searchCoin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name } = req.query;

    const coins = await getRepository(Coin).find();

    const fuse = new Fuse(coins, {
      keys: ["name", "symbol"],
    });

    const searchResult = fuse.search(name as string);

    if (searchResult.length === 0) {
      return next(createHttpError(400, "could not search coin"));
    }

    res.status(200).json(searchResult[0].item);
  } catch (error) {
    next(createHttpError(400, "could not search coin"));
  }
};

export { searchCoin };
