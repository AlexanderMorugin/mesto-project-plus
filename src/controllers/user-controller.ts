import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
// import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { UserRequest } from '../utils/user-request';
import User from '../models/user';
import { STATUS_CREATED, STATUS_SUCCESS } from '../utils/status-error';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
// import UnauthorizedError from '../errors/unauthorized-error';
import ForbiddenError from '../errors/forbidden-error';
import JWT_KEY from '../utils/jwt-key';

const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => {
      res.status(STATUS_SUCCESS).send(users);
    })
    .catch(next);
};

const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь с данным ID не найден'));
      }
      res.status(STATUS_SUCCESS).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь с данным ID не найден'));
      }
      next(err);
    });
};

const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;

  return bcrypt.hash(password, 10)
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
            next(new ConflictError('Пользователь с таким email уже существует'));
          }
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Неправильные почта или пароль'));
          }
          next(err);
        });
    })
    .catch(next);
};

const updateUser = (req: UserRequest, res: Response, next: NextFunction) => {
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

const updateAvatar = (req: UserRequest, res: Response, next: NextFunction) => {
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

const loginUser = (req: UserRequest, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_KEY,
        // (process.env.TOKEN_ENV as string) || crypto.randomBytes(32).toString('hex'),
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, { httpOnly: true, expires: new Date(Date.now() + 3600000 * 24 * 7), sameSite: true });
      res.send({ user, token });
    })
    .catch(next);
};

const getCurrentUser = (req: UserRequest, res: Response, next: NextFunction) => {
  User.findById(req.user?._id)
    .then((user) => {
      if (!user) {
        next(new ForbiddenError('Пользователь не найден'));
      }
      res.status(STATUS_SUCCESS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному ID не найден'));
      }
      next(err);
    });
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  loginUser,
  getCurrentUser,
};
