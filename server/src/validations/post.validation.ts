import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const validatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const postSchema = Joi.object({
      title: Joi.string().min(1).max(30).required(),
      content: Joi.string().min(1).max(300).required(),
      rise: Joi.boolean().required(),
      fall: Joi.boolean().required(),
    });

    const value = await postSchema.validateAsync(req.body);
    req.body = value;
    next();
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export { validatePost };
