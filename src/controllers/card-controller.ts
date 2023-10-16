import { Request, Response, NextFunction } from 'express';
import { STATUS_CREATED, STATUS_SUCCESS } from '../utils/status-error';
import Card from '../models/card';
import { UserRequest } from '../utils/user-request';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';
import ForbiddenError from '../errors/forbidden-error';

const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({}).populate(['owner', 'likes'])
    .then((cards) => {
      res.status(STATUS_SUCCESS).send({ data: cards });
    })
    .catch(next);
};

const createCard = (req: UserRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user?._id })
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

export const deleteCardById = (req: UserRequest, res: Response, next: NextFunction) => {
  console.log('cardId: ', req.params.cardId);
  console.log('userId: ', req.user!._id);

  Card.findById(req.params.cardId)
    .then((card) => {
      console.log('card-owner: ', card?.owner);

      if (!card) {
        next(new NotFoundError('Карточка по указанному _id не найдена'));
        return;
      }

      if (card.owner !== req.user!._id) {
        next(new ForbiddenError('У вас нет прав для удаления этой карточки'));
      } else {
        card.remove()
          .then(() => res.send({ data: card }))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Карточка по указанному _id не найдена'));
        return;
      }
      next(err);
    });
};

const likeCard = (req: UserRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    {
      new: true,
      runValidators: true,
    },
  ).populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка по указанному ID не найдена'));
      } else {
        res.status(STATUS_CREATED).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Неправильный ID карточки'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const dislikeCard = (req: UserRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    {
      new: true,
      runValidators: true,
    },
  ).populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка по указанному ID не найдена'));
      } else {
        res.status(STATUS_SUCCESS).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Неправильный ID карточки'));
        return;
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
