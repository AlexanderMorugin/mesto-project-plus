import { Router } from 'express';
import controller from '../controllers/user-controller';
import validation from '../validation/validation';

const userRouter = Router();

userRouter.get('/', controller.getUsers);
userRouter.get('/me', controller.getCurrentUser);
userRouter.get('/:userId', validation.validateGetUserById, controller.getUserById);
userRouter.patch('/me', validation.validateUpdateUser, controller.updateUser);
userRouter.patch('/me/avatar', validation.validateUpdateAvatar, controller.updateAvatar);

export default userRouter;
