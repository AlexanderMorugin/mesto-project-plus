import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized-error';
import JWT_KEY from '../utils/jwt-key';
import { UserRequest } from '../utils/user-request';

export default (req: UserRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Вам надо авторизоваться'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_KEY);
  } catch (err) {
    next(new UnauthorizedError('Данный токен неактуален'));
    return;
  }

  req.user = { _id: payload as ObjectId }; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
