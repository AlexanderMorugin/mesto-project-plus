import { STATUS_BAD_REQUEST } from '../utils/status-error';
import { IError } from '../utils/i-error';

class BadRequestError extends Error implements IError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_BAD_REQUEST;
  }
}

export default BadRequestError;
