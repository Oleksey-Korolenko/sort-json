import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../common/response';

export const catchError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    errorResponse(err, res);
  } else {
    next();
  }
};
