/* eslint-disable import/prefer-default-export */
import { STATUS_NOT_FOUND } from '../utils/status-error';
import { IError } from '../utils/i-error';

export class NotFoundError extends Error implements IError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_NOT_FOUND;
    // this.message = message;
  }
}
