import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const validateInterestCoin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const interestSchema = Joi.object({
      interest: Joi.boolean().required(),
    });

    const value = await interestSchema.validateAsync(req.body);
    req.body = value;
    next();
  } catch (error) {
    next(error);
  }
};

export { validateInterestCoin };
