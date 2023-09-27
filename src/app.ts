import express, { Request, Response } from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user";

// import { connectToDb, getDb } from "./db";
// import { ObjectId } from "mongodb";
import User from "./models/user"

const { PORT = 3000 } = process.env;
const URL = "mongodb://localhost:27017/mestodb";

const app = express();
app.use(express.json());

mongoose
  .connect(URL)
  .then(() => console.log("Успешное соединение с MongoDB"))
  .catch((err) =>
    console.log(`Произошла ошибка при подсоединении к MongoDB: ${err}`)
  );

app.listen(PORT, () => {
  console.log(`Сервер запущен на порте http://localhost:${PORT}`);
});

// let db: any;

// connectToDb((err: any) => {
//   if (!err) {
//     // app.listen(PORT, () => {
//     //   console.log(`Сервер запущен на порте http://localhost:${PORT}`);
//     // });
//     db = getDb();
//   } else {
//     console.log(`Произошла ошибка подключения к серверу: ${err}`);
//   }
// });

app.get("/users", (req, res) => {
  // const users: any = [];

  User
    // .collection("users")
    .find()
    // .sort({ name: -1 })
    // .forEach((user: any) => users.push(user))
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(() => {
      res.status(500).json({ error: "Что то пошло не так..." });
    });
});

app.get("/users/:id", (req, res) => {
  // if (ObjectId.isValid(req.params.id)) {
    User
      // .collection("users")
      // .findOne({ _id: new ObjectId(req.params.id) })
      .findById(req.params.id)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch(() => {
        res.status(500).json({ error: "Что то пошло не так..." });
      });
  // } else {
  //   res.status(500).json({ error: "ID Wrong" });
  // }
});

app.delete("/users/:id", (req, res) => {
  // if (ObjectId.isValid(req.params.id)) {
    User
      // .collection("users")
      .findByIdAndDelete(req.params.id)
      .then((result: any) => {
        res.status(200).json(result);
      })
      .catch(() => {
        res.status(500).json({ error: "Что то пошло не так..." });
      });
  // } else {
  //   res.status(500).json({ error: "ID Wrong" });
  // }
});

app.post("/users", (req, res) => {
  const postUser = new User(req.body);

  postUser
    .save()
    .then((result: any) => {
      res
        .status(201)
        .json(result);
    })
    .catch(() => {
      res.status(500).json({ error: "Что то пошло не так..." });
    });
});

app.patch("/users/:id", (req, res) => {
  // if (ObjectId.isValid(req.params.id)) {
    User
      // .collection("users")
      .findByIdAndUpdate(req.params.id, req.body)
      .then((result: any) => {
        res.status(200).json(result);
      })
      .catch(() => {
        res.status(500).json({ error: "Что то пошло не так..." });
      });
  // } else {
  //   res.status(500).json({ error: "ID Wrong" });
  // }
});

// const URL = "mongodb://localhost:27017/mestodb";

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// mongoose.connect(URL);

// app.use('/users', userRouter);
