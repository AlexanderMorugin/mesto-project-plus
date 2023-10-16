import { Request, Response, NextFunction } from 'express';
import { IError } from '../utils/i-error';
import { STATUS_SERVER_ERROR } from '../utils/status-error';

const errorsMiddleware = (err: IError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = STATUS_SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message: statusCode === STATUS_SERVER_ERROR ? 'На сервере произошла ошибка' : message,
  });
  next();
};

export default errorsMiddleware;
