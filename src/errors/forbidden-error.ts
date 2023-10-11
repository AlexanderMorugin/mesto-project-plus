/* eslint-disable import/prefer-default-export */
import { STATUS_FORBIDDEN } from '../utils/status-error';
import { IError } from '../utils/i-error';

export class ForbiddenError extends Error implements IError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_FORBIDDEN;
  }
}
