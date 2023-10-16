import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import { errors } from 'celebrate';
import userRouter from './routes/user-routes';
import cardRouter from './routes/card-routes';
import notFoundRouter from './routes/not-found-routes';
import auth from './middlewares/auth-middleware';
import controller from './controllers/user-controller';
import { requestLogger, errorLogger } from './middlewares/logger-middleware';
import errorsMiddleware from './middlewares/errors-middleware';
import validation from './validation/validation';
import limiter from './utils/limiter';

require('dotenv').config();

const { PORT = 3000 } = process.env;
const URL = 'mongodb://localhost:27017/mestodb';

const app = express();

mongoose.connect(URL)
  .then(() => console.log('Успешное соединение с MongoDB'))
  .catch((err) => {
    console.log(`Произошла ошибка при подсоединении к MongoDB: ${err}`);
  });

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(limiter);

app.post('/signup', validation.validateCreateUser, controller.createUser);
app.post('/signin', validation.validateLoginUser, controller.loginUser);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', notFoundRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorsMiddleware);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порте http://localhost:${PORT}`);
});
