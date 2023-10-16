import { Router } from 'express';
import validation from '../validation/validation';
import controller from '../controllers/card-controller';

const cardRouter = Router();

cardRouter.get('/', controller.getCards);
cardRouter.post('/', validation.validateCreateCard, controller.createCard);
cardRouter.delete('/:cardId', validation.validateCardById, controller.deleteCardById);
cardRouter.put('/:cardId/likes', validation.validateCardById, controller.likeCard);
cardRouter.delete('/:cardId/likes', validation.validateCardById, controller.dislikeCard);

export default cardRouter;
