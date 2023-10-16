import { STATUS_FORBIDDEN } from '../utils/status-error';
import { IError } from '../utils/i-error';

class ForbiddenError extends Error implements IError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_FORBIDDEN;
  }
}

export default ForbiddenError;
