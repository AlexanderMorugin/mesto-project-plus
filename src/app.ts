import express, { Request, Response } from 'express';

const app = express();
const { PORT = 3000 } = process.env;


app.listen(PORT, () => {
  console.log(`Сервер запущен на порте http://localhost:${PORT}`)
})