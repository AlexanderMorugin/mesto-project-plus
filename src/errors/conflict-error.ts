/* eslint-disable import/prefer-default-export */
import { STATUS_CONFLICT } from '../utils/status-error';
import { IError } from '../utils/i-error';

export class ConflictError extends Error implements IError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_CONFLICT;
  }
}
