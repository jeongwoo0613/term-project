import { NextFunction, Request, Response } from "express";
import { ValidationError } from "joi";

interface IError {
  status: number;
  message: string;
}

const errorLogger = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(err);
  next(err);
};

const errorHandler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errorStatusCode =
    err instanceof ValidationError ? 400 : err.status || 500;
  const errorMessage = err.message || "Internal Server Error";

  res.status(errorStatusCode).json({
    code: errorStatusCode,
    error: errorMessage,
  });
};

export { errorLogger, errorHandler };
