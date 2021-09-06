import { NextFunction, Request, Response } from "express";

const errorLogger = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(err);
  next(err);
};

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errorStatusCode = err.status || 500;
  const errorMessage = err.message || "Internal Server Error";

  res.status(errorStatusCode).json({
    code: errorStatusCode,
    error: errorMessage,
  });
};

export { errorLogger, errorHandler };
