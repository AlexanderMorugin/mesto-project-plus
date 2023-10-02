/* eslint-disable import/no-import-module-exports */
import { Request, Response } from 'express';
// eslint-disable-next-line import/no-unresolved
import {
  CARD_NOT_FOUND_MESSAGE,
  // eslint-disable-next-line import/named
  CREATE_SUCCES_MESSAGE,
  INVALID_DATA_MESSAGE,
  SERVER_ERROR_MESSAGE,
  STATUS_BAD_REQUEST,
  STATUS_CREATED,
  STATUS_NOT_FOUND,
  STATUS_SERVER_ERROR,
  STATUS_SUCCESS,
  SUCCES_MESSAGE,
} from '../utils/status-error';
import Card from '../models/card';
import { UserRequest } from '../utils/user-request';

export const getCards = (req: Request, res: Response) => {
  Card
    .find({})
    .then((cards) => {
      console.log(SUCCES_MESSAGE);
      res.status(STATUS_SUCCESS).send({ data: cards });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
    });
};

export const createCard = (req: UserRequest, res: Response) => {
  const { name, link } = req.body;
  const userId = req.user?._id;

  return Card
    .create({ name, link, owner: userId })
    .then((card) => {
      console.log(CREATE_SUCCES_MESSAGE);
      res.status(STATUS_CREATED).send({ data: card });
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

export const deleteCardById = (req: Request, res: Response) => {
  const { cardId } = req.params;

  return Card
    .findByIdAndDelete(cardId)
    .then((result) => {
      console.log(SUCCES_MESSAGE);
      res.status(STATUS_SUCCESS).json(result);
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(STATUS_NOT_FOUND).send({ message: CARD_NOT_FOUND_MESSAGE });
      } else {
        console.log(err.message);
        res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

export const likeCard = (req: UserRequest, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  return Card
    .findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    )
    .then((result) => {
      console.log(CREATE_SUCCES_MESSAGE);
      res.status(STATUS_CREATED).json(result);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({ message: INVALID_DATA_MESSAGE });
      } else if (err.name === 'NotFoundError') {
        res.status(STATUS_NOT_FOUND).send({ message: CARD_NOT_FOUND_MESSAGE });
      } else {
        console.log(err.message);
        res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

export const dislikeCard = (req: UserRequest, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  return Card
    .findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((result) => {
      console.log(SUCCES_MESSAGE);
      res.status(STATUS_SUCCESS).json(result);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({ message: INVALID_DATA_MESSAGE });
      } else if (err.name === 'NotFoundError') {
        res.status(STATUS_NOT_FOUND).send({ message: CARD_NOT_FOUND_MESSAGE });
      } else {
        console.log(err.message);
        res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

// module.exports.getCards = (req: Request, res: Response) => Card
//   .find({})
//   .populate('owner')
//   .then((cards) => res.send({ data: cards }))
//   .catch((err) => res.status(500).send({ message: err.message }));
