import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const validateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const commentSchema = Joi.object({
      content: Joi.string().min(1).max(150).required(),
    });

    const value = await commentSchema.validateAsync(req.body);
    req.body = value;
    next();
  } catch (error) {
    next(error);
  }
};

export { validateComment };
