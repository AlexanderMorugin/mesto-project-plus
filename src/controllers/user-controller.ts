import { Request, Response } from 'express';
import User from '../models/user';
import { UserRequest } from 'utils/user-request';

export const getUsers = (req: Request, res: Response) => User
  .find({})
  .then((users) => res.send({ data: users }))
  .catch((err) => res.status(500).send({ message: err.message }));

export const getUserById = (req: Request, res: Response) => User
  .findById(req.params.id)
  .then((user) => {
    res.status(200).json(user);
  })
  .catch((err) => res.status(500).send({ message: err.message }));

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User
    .create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

export const updateUser = (req: UserRequest, res: Response) => {
  const { name, about } = req.body;
  const id = req.user?._id;

  User
    .findByIdAndUpdate(id, { name, about })
    .then((result: any) => {
      res.status(200).json(result);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// export const deleteUserById = (req: Request, res: Response) => User
//   .findByIdAndDelete(req.params.id)
//   .then((result: any) => {
//     res.status(200).json(result);
//   })
//   .catch((err) => res.status(500).send({ message: err.message }));


