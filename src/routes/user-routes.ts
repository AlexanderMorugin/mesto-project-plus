import { Router } from "express";
import { createUser, deleteUserById, getUserById, getUsers, updateUser } from "../controllers/user-controller";

const userRouter = Router();

userRouter.get("/users", getUsers);
userRouter.get("/users/:id", getUserById);
userRouter.delete("/users/:id", deleteUserById);
userRouter.post("/users", createUser);
userRouter.patch("/users/:id", updateUser);

export default userRouter;
