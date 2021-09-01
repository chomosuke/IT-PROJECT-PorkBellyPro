export class ResponseStatus implements Pick<Response, 'ok' | 'status' | 'statusText'> {
  readonly ok;

  readonly status;

  readonly statusText;

  constructor({ ok, status, statusText }: Response) {
    this.ok = ok;
    this.status = status;
    this.statusText = statusText;
  }
}
