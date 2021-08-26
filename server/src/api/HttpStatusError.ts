import { STATUS_CODES } from 'http';

export class HttpStatusError extends Error {
  public readonly code: number;

  constructor(code: number, message?: string) {
    super(message ?? STATUS_CODES[code]);
    this.code = code;
  }
}
