import express, { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { errors } from 'celebrate';
import userRouter from './routes/user-routes';
import cardRouter from './routes/card-routes';
import { UserRequest } from './utils/user-request';
import auth from './middlewares/auth-middleware';
import { createUser, loginUser } from './controllers/user-controller';
import { requestLogger, errorLogger } from './middlewares/logger-middleware';
// eslint-disable-next-line import/named
import { errorsMiddleware } from './middlewares/errors-middleware';

require('dotenv').config();

const { PORT = 3000 } = process.env;
const URL = 'mongodb://localhost:27017/mestodb';

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

// подключаем rate-limiter
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use((req: UserRequest, res: Response, next: NextFunction) => {
//   req.user = {
//     _id: '65157dee0c808465f2406638',
//   };

//   next();
// });

app.use(helmet());

app.use(requestLogger); // подключаем логер запросов
// за ним идут все обработчики роутов

// роуты, не требующие авторизации,
// например, регистрация и логин
app.post('/signup', createUser);
app.post('/signin', loginUser);

// авторизация
// app.use(auth);

// роуты, которым авторизация нужна
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errorLogger); // подключаем логер ошибок
// подключить после обработчиков роутов и до обработчиков ошибок

app.use(errors()); // обработчик ошибок celebrate

// централизованный обработчик ошибок, здесь обрабатываем все ошибки
app.use(errorsMiddleware);

mongoose
  .connect(URL)
  .then(() => console.log('Успешное соединение с MongoDB'))
  .catch((err) => {
    console.log(`Произошла ошибка при подсоединении к MongoDB: ${err}`);
  });

app.listen(PORT, () => {
  console.log(`Сервер запущен на порте http://localhost:${PORT}`);
});
