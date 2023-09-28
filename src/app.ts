import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user-routes';

const { PORT = 3000 } = process.env;
const URL = 'mongodb://localhost:27017/mestodb';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', userRouter);

mongoose
  .connect(URL)
  .then(() => console.log('Успешное соединение с MongoDB'))
  .catch((err) => {
    console.log(`Произошла ошибка при подсоединении к MongoDB: ${err}`);
  });

app.listen(PORT, () => {
  console.log(`Сервер запущен на порте http://localhost:${PORT}`);
});
