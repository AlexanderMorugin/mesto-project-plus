import express, { Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import helmet from 'helmet';
import { errors } from 'celebrate';
import userRouter from './routes/user-routes';
import cardRouter from './routes/card-routes';
import notFoundRouter from './routes/not-found-routes';
import { UserRequest } from './utils/user-request';
import auth from './middlewares/auth-middleware';
// import { createUser, loginUser } from './controllers/user-controller';
import userController from './controllers/user-controller';
import { requestLogger, errorLogger } from './middlewares/logger-middleware';
// eslint-disable-next-line import/named
import { errorsMiddleware } from './middlewares/errors-middleware';
import userValidator from './validation/user-validation';
import limiter from './utils/limiter';


require('dotenv').config();

const { PORT = 3000 } = process.env;
const URL = 'mongodb://localhost:27017/mestodb';

const app = express();



// подключаем rate-limiter
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.use(requestLogger); // подключаем логер запросов
// за ним идут все обработчики роутов

// роуты, не требующие авторизации,
// например, регистрация и логин
app.post('/signup', userValidator.validateCreateUser, userController.createUser);
app.post('/signin', userValidator.validateLoginUser, userController.loginUser);

// авторизация
// app.use(auth);

// роуты, которым авторизация нужна
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', notFoundRouter);

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
