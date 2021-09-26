export class WorkerTerminatedError extends Error {
  constructor() {
    super('Worker was terminated');
  }
}
