import { Router, Request, Response } from "express";
import User from "../models/user";
import { createUser } from "../controllers/user";

const userRouter = Router();

// userRouter.get("/users", getUsers);

// router.get("/users/:userId", (req: Request, res: Response) => {

// })

userRouter.post("/users", createUser);

export default userRouter;
