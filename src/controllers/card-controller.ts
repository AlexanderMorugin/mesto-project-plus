/* eslint-disable import/no-import-module-exports */
import { Request, Response } from 'express';
import Card from '../models/card';
import { UserRequest } from '../utils/user-request';

export const getCards = (req: Request, res: Response) => Card
  .find({})
  .then((cards) => res.send({ data: cards }))
  .catch((err) => res.status(500).send({ message: err.message }));

export const createCard = (req: UserRequest, res: Response) => {
  const { name, link } = req.body;
  const ownerId = req.user?._id;

  return Card
    .create({ name, link, owner: ownerId })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getCards = (req: Request, res: Response) => Card
  .find({})
  .populate('owner')
  .then((cards) => res.send({ data: cards }))
  .catch((err) => res.status(500).send({ message: err.message }));
