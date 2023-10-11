import { Router } from 'express';
import userController from '../controllers/user-controller';
import userValidator from '../validation/user-validation';

const userRouter = Router();

userRouter.get('/', userController.getUsers);
userRouter.get('/me', userController.getCurrentUser);
userRouter.get('/:userId', userValidator.validateGetUserById, userController.getUserById);
userRouter.patch('/me', userValidator.validateUpdateUser, userController.updateUser);
userRouter.patch('/me/avatar', userValidator.validateUpdateAvatar, userController.updateAvatar);

export default userRouter;
