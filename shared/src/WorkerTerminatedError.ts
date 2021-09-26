export class WorkerTerminatedError <Reason> extends Error {
  readonly reason: Reason;

  constructor(reason: Reason) {
    super('Worker was terminated');
    this.reason = reason;
  }
}
