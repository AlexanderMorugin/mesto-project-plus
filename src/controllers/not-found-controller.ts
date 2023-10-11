import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../errors/not-found-error';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Страница не найдена'));
};

export default notFound;
