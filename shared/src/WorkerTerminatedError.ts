export class WorkerTerminatedError extends Error {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  readonly reason?: any;

  constructor(reason?: any) {
    /* eslint-enable */
    super('Worker was terminated');
    this.reason = reason;
  }
}
