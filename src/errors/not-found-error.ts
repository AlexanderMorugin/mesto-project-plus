import { STATUS_NOT_FOUND } from '../utils/status-error';
import { IError } from '../utils/i-error';

class NotFoundError extends Error implements IError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_NOT_FOUND;
  }
}

export default NotFoundError;
