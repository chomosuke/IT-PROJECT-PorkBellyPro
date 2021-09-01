type ResponseStatusValues = Pick<Response, 'ok' | 'status' | 'statusText'>;

export class ResponseStatus implements ResponseStatusValues {
  readonly ok;

  readonly status;

  readonly statusText;

  constructor({ ok, status, statusText }: ResponseStatusValues) {
    this.ok = ok;
    this.status = status;
    this.statusText = statusText;
  }
}
