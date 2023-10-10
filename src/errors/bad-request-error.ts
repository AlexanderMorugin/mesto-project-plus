/* eslint-disable import/prefer-default-export */
import { STATUS_BAD_REQUEST } from '../utils/status-error';
import { IError } from '../utils/i-error';

export class BadRequestError extends Error implements IError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_BAD_REQUEST;
    // this.message = message;
  }
}
