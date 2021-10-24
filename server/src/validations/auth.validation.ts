import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const validateSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const signupSchema = Joi.object({
      userId: Joi.string()
        .pattern(/^[a-z0-9]+$/)
        .min(4)
        .max(16)
        .required(),
      password: Joi.string()
        .pattern(/(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^0-9a-zA-Z])/)
        .required(),
      nickname: Joi.string().min(1).max(30).required(),
    });

    const value = await signupSchema.validateAsync(req.body);
    req.body = value;
    next();
  } catch (error) {
    next(error);
  }
};

export { validateSignup };
