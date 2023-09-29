import { Router } from 'express';
import {
  getCards, createCard,
  deleteCardById,
  putCardLike,
} from '../controllers/card-controller';

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCardById);
cardRouter.put('/:cardId/likes', putCardLike);
// cardRouter.delete('/:cardId', deleteCardById);

export default cardRouter;
