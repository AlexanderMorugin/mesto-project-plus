import { Request, Response } from 'express';

// eslint-disable-next-line import/no-unresolved
import { UserRequest } from 'utils/user-request';
import bcrypt from 'bcrypt';
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

export const getUsers = (req: Request, res: Response) => {
  User
    .find({})
    .then((users) => {
      console.log(SUCCES_MESSAGE);
      res.status(STATUS_SUCCESS).send({ data: users });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
    });
};

export const getUserById = (req: Request, res: Response) => {
  const { userId } = req.params;

  return User
    .findById(userId)
    .then((user) => {
      console.log(SUCCES_MESSAGE);
      res.status(STATUS_SUCCESS).json(user);
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(STATUS_NOT_FOUND).send({ message: USER_NOT_FOUND_MESSAGE });
      } else {
        console.log(err.message);
        res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
}

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User
    .create({ name, about, avatar })
    .then((user) => {
      console.log(CREATE_SUCCES_MESSAGE);
      res.status(STATUS_CREATED).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message: INVALID_DATA_MESSAGE });
      } else {
        console.log(err.message);
        res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

export const updateUser = (req: UserRequest, res: Response) => {
  const { name, about } = req.body;
  const userId = req.user?._id;

  return User
    .findByIdAndUpdate(userId, { name, about })
    .then((result) => {
      console.log(SUCCES_MESSAGE);
      res.status(STATUS_SUCCESS).json(result);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message: INVALID_DATA_MESSAGE });
      } else if (err.name === 'NotFoundError') {
        res.status(STATUS_NOT_FOUND).send({ message: USER_NOT_FOUND_MESSAGE });
      } else {
        console.log(err.message);
        res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

export const updateAvatar = (req: UserRequest, res: Response) => {
  const { avatar } = req.body;
  const userId = req.user?._id;

  return User
    .findByIdAndUpdate(userId, { avatar })
    .then((result) => {
      console.log(SUCCES_MESSAGE);
      res.status(STATUS_SUCCESS).json(result);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message: INVALID_DATA_MESSAGE });
      } else if (err.name === 'NotFoundError') {
        res.status(STATUS_NOT_FOUND).send({ message: USER_NOT_FOUND_MESSAGE });
      } else {
        console.log(err.message);
        res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        // хеши не совпали — отклоняем промис
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      // аутентификация успешна
      res.send({ message: 'Всё верно!' });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
