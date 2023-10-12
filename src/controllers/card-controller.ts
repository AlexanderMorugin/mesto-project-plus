/* eslint-disable import/no-import-module-exports */
import { Request, Response, NextFunction } from 'express';
// eslint-disable-next-line import/no-unresolved
import { STATUS_CREATED, STATUS_SUCCESS } from '../utils/status-error';
import Card from '../models/card';
import { UserRequest } from '../utils/user-request';
import { BadRequestError } from '../errors/bad-request-error';
import { NotFoundError } from '../errors/not-found-error';
import { ForbiddenError } from '../errors/forbidden-error';

const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({}).populate(['owner', 'likes'])
    .then((cards) => {
      res.status(STATUS_SUCCESS).send({ data: cards });
    })
    .catch(next);
};

const createCard = (req: UserRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const userId = req.user?._id;

  return Card.create({ name, link, owner: userId })
    .then((card) => {
      res.status(STATUS_CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const deleteCardById = (req: UserRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка по указанному _id не найдена'));
      }

      if (card?.owner === userId) {
        card?.remove()
          .then(() => res.status(STATUS_SUCCESS).send({ data: card }))
          .catch(next);
      } else {
        next(new ForbiddenError('У вас нет прав для удаления'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Карточка по указанному _id не найдена'));
      }
      next(err);
    });
};

const likeCard = (req: UserRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    {
      new: true,
      runValidators: true,
    },
  ).populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка по указанному _id не найдена'));
      } else {
        res.status(STATUS_CREATED).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const dislikeCard = (req: UserRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    {
      new: true,
      runValidators: true,
    },
  ).populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка по указанному _id не найдена'));
      } else {
        res.status(STATUS_SUCCESS).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

export default {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
