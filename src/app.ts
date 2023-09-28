import express, { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user-routes';
import cardRouter from './routes/card-routes';
import { UserRequest } from './utils/user-request';

const { PORT = 3000 } = process.env;
const URL = 'mongodb://localhost:27017/mestodb';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: UserRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '65157dee0c808465f2406638',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

mongoose
  .connect(URL)
  .then(() => console.log('Успешное соединение с MongoDB'))
  .catch((err) => {
    console.log(`Произошла ошибка при подсоединении к MongoDB: ${err}`);
  });

app.listen(PORT, () => {
  console.log(`Сервер запущен на порте http://localhost:${PORT}`);
});
