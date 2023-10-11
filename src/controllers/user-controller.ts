/* eslint-disable consistent-return */
import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line import/no-unresolved
import { UserRequest } from 'utils/user-request';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import {
  STATUS_CREATED,
  STATUS_SUCCESS,
} from '../utils/status-error';
import { NotFoundError } from '../errors/not-found-error';
import { BadRequestError } from '../errors/bad-request-error';
import { ConflictError } from '../errors/conflict-error';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { ForbiddenError } from '../errors/forbidden-error';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => {
      res.status(STATUS_SUCCESS).send(users);
    })
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному ID не найден'));
      }
      res.status(STATUS_SUCCESS).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному ID не найден'));
      }
      next(err);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;

  return bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          res.status(STATUS_CREATED).send({
            _id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('Пользователь с такой почтой уже существует'));
          }
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Неправильные почта или пароль'));
          }
          next(err);
        });
    })
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
      res.status(STATUS_SUCCESS).send(result);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному ID не найден'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
      }
      next(err);
    });
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
      res.status(STATUS_SUCCESS).json(result);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному ID не найден'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      }
      next(err);
    });
};

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError('Неправильные почта или пароль'));
      }
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        // (process.env.TOKEN_ENV as string) || crypto.randomBytes(32).toString('hex'),
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, { httpOnly: true, expires: new Date(Date.now() + 3600000 * 24 * 7), sameSite: true });
      res.send({ user, token });
    })
    .catch(next);
};

export const getCurrentUser = (req: UserRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  User.findById(userId)
    .then((user) => res.send(user))
    // .then((user) => {
    //   // console.log(userId)
    //   if (!user) {
    //     next(new ForbiddenError('Доступ невозможен'));
    //   }
    //   res.status(STATUS_SUCCESS).send(user);
    // })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному ID не найден'));
      }
      next(err);
    });
};
