import express, { Request, Response } from "express";
import mongoose from 'mongoose';

const app = express();
const { PORT = 3000 } = process.env;
const URL = "mongodb://localhost:27017/mestodb";

mongoose
  .connect(URL)
  .then(() => console.log("Успешное соединение с MongoDB"))
  .catch((err) => console.log(`Произошла ошибка при подсоединении к MongoDB: ${err}`))


app.listen(PORT, () => {
  console.log(`Сервер запущен на порте http://localhost:${PORT}`);
});
