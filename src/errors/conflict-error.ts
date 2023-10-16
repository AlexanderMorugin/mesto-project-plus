import { STATUS_CONFLICT } from '../utils/status-error';
import { IError } from '../utils/i-error';

class ConflictError extends Error implements IError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_CONFLICT;
  }
}

export default ConflictError;
