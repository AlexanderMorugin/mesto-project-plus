import winston from 'winston';
import expressWinston from 'express-winston';
import 'winston-daily-rotate-file';

const errorTransport = new winston.transports.DailyRotateFile({
  filename: 'error-%DATE%.log',
  datePattern: 'HH-DD-MM-YYYY',
  maxFiles: 3,
});

const requestTransport = new winston.transports.DailyRotateFile({
  filename: 'request-%DATE%.log',
  datePattern: 'HH-DD-MM-YYYY',
  maxFiles: 3,
});

const requestLogger = expressWinston.logger({
  transports: [
    requestTransport,
  ],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    errorTransport,
  ],
  format: winston.format.json(),
});

export { requestLogger, errorLogger };
