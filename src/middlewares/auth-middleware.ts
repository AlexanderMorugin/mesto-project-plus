import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
// import crypto from 'crypto';

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

const handleAuthError = (res: Response) => {
  res
    .status(401)
    .send({ message: 'Необходима авторизация' });
};

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;
  // const token = authorization.replace('Bearer ', '');
  // console.log(token);
  // let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key') as jwt.JwtPayload;
  } catch (err) {
    return handleAuthError(res);
  }

  // req.user = payload; // записываем пейлоуд в объект запроса
  req.user = { _id: payload._id };

  next(); // пропускаем запрос дальше

  // try {
  //   payload = jwt.verify(token, 'some-secret-key');
  // eslint-disable-next-line max-len
  // payload = jwt.verify(token, process.env.TOKEN_ENV as string || crypto.randomBytes(32).toString('hex'));
  // } catch (err) {
  //   return handleAuthError(res);
  // }

  // req.user = payload; // записываем пейлоуд в объект запроса

  // next(new Error('Ошибка авторизации')); // пропускаем запрос дальше
};
