import { Router } from 'express';
import {
  createUser, getUserById, getUsers,
} from '../controllers/user-controller';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);

// userRouter.delete('/:id', deleteUserById);
// userRouter.patch('/:id', updateUser);

export default userRouter;
