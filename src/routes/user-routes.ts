import { Router } from 'express';
import {
  createUser, getUserById, getUsers, updateUser,
} from '../controllers/user-controller';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUser);
// userRouter.patch('/me/avatar', updateAvatar);

export default userRouter;
