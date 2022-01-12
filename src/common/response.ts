import { Response } from 'express';
import HttpStatus from 'http-status-codes';

export const sendResponse = <T>(status: number, values: T, res: Response) => {
  res.statusCode = status;
  return res.send({
    status,
    ...values,
  });
};

export const errorResponse = (_err: unknown, res: Response) => {
  let status = HttpStatus.BAD_REQUEST;
  let message = `Something went wrong!`;
  if (_err instanceof Error) {
    message = _err.message;
  }
  if (_err instanceof TypeError) {
    message = _err.message;
    status = HttpStatus.FORBIDDEN;
  }
  return sendResponse(status, { message }, res);
};
