import { STATUS_UNAUTHORIZED } from '../utils/status-error';
import { IError } from '../utils/i-error';

class UnauthorizedError extends Error implements IError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_UNAUTHORIZED;
  }
}

export default UnauthorizedError;
