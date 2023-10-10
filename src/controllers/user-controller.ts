/* eslint-disable consistent-return */
import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line import/no-unresolved
import { UserRequest } from 'utils/user-request';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import {
  CREATE_SUCCES_MESSAGE,
  INVALID_DATA_MESSAGE,
  SERVER_ERROR_MESSAGE,
  STATUS_BAD_REQUEST,
  STATUS_CREATED,
  STATUS_NOT_FOUND,
  STATUS_SERVER_ERROR,
  STATUS_SUCCESS,
  SUCCES_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
} from '../utils/status-error';
import { NotFoundError } from '../errors/not-found-error';
import { BadRequestError } from '../errors/bad-request-error';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => {
      console.log(SUCCES_MESSAGE);
      res.status(STATUS_SUCCESS).send(users);
    })
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  return User
    .findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному ID не найден');
      }
      res.status(STATUS_SUCCESS).send(user);
    })
    // .catch((err) => {
    //   console.log(err);
    //   if (err.name === 'CastError' || err.name === 'ValidationError') {
    //     throw new NotFoundError('Пользователь по указанному ID не найден');
    //   }
    //   // next(err);
    // });
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash: string) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(STATUS_CREATED).send({
        _id: user,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    // .catch((err) => {
    //   console.log(err);
    //   if (err.name === 'CastError' || err.name === 'ValidationError') {
    //     throw new BadRequestError('Переданы некорректные данные');
    //   }
    //   next(err);
    // });
    .catch(next);
};

export const updateUser = (req: UserRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const userId = req.user?._id;

  return User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((result) => {
      console.log(SUCCES_MESSAGE);
      res.status(STATUS_SUCCESS).send(result);
    })
    // .catch((err) => {
    //   if (err.name === 'CastError' || err.name === 'ValidationError') {
    //     throw new BadRequestError('Переданы некорректные данные при обновлении пользователя');
    //   }
    //   next(err);
    // });
    .catch(next);
};

export const updateAvatar = (req: UserRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const userId = req.user?._id;

  return User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((result) => {
      console.log(SUCCES_MESSAGE);
      res.status(STATUS_SUCCESS).json(result);
    })
    // .catch((err) => {
    //   if (err.name === 'CastError' || err.name === 'ValidationError') {
    //     throw new BadRequestError('Переданы некорректные данные при обновлении аватара');
    //   }
    //   next(err);
    // });
    .catch(next);
};

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // if (!user) {
      //   res.status(401).send({ message: 'Неправильные почта или пароль' });
      //   // throw new UnauthorizedError('Неправильные почта или пароль');
      // }
      res.send({
        token: jwt.sign(
          { _id: user._id },
          // 'some-secret-key',
          process.env.TOKEN_ENV as string || crypto.randomBytes(32).toString('hex'),
          { expiresIn: '7d' },
        ),
      });
    })
    .catch((err) => {
      // res.status(401).send({ message: err.message });
      console.log(err.message);
      res.status(401).send({ message: 'Неправильные почта или пароль' });
      next(err);
    });
    // .catch(next);
};

// export const loginUser = (req: Request, res: Response, next: NextFunction) => {
//   const { email, password } = req.body;

//   return User.findOne({ email }).select('+password')
//     .then((user) => {
//       if (!user) {
//         throw new Error('Неправильные почта или пароль');
//       }
//       return bcrypt.compare(password, user.password)
//         .then((matched) => {
//           if (!matched) {
//             throw new Error('Неправильные почта или пароль');
//           }
//           const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
//           res.send({ token });
//         });
//     })
//     .catch(next);
// };
