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
  const userId = req.user?._id;

  return Card
    .create({ name, link, owner: userId })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

export const deleteCardById = (req: Request, res: Response) => {
  const { cardId } = req.params;

  Card
    .findByIdAndDelete(cardId)
    .then((result: any) => {
      res.status(200).json(result);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

export const likeCard = (req: UserRequest, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  Card
    .findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((result: any) => {
      res.status(200).json(result);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

export const dislikeCard = (req: UserRequest, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  Card
    .findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((result: any) => {
      res.status(200).json(result);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// module.exports.getCards = (req: Request, res: Response) => Card
//   .find({})
//   .populate('owner')
//   .then((cards) => res.send({ data: cards }))
//   .catch((err) => res.status(500).send({ message: err.message }));
