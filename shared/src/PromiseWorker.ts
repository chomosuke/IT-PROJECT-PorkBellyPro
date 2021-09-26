import { WorkerTerminatedError } from './WorkerTerminatedError';

interface PromiseCallbacks<Result> {
  resolve: (value: Result | PromiseLike<Result>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject: (reason?: any) => void;
}

export class PromiseWorker<Message, Result> {
  private worker: Worker;

  private readonly workerFactory: () => Worker;

  private callbacks: (PromiseCallbacks<Result> | undefined)[] = [];

  constructor(workerFactory: () => Worker) {
    this.workerFactory = workerFactory;
    this.worker = workerFactory();
    this.worker.addEventListener('message', this.onMessage.bind(this));
    this.worker.addEventListener('error', this.onError.bind(this));
  }

  post(message: Message, options?: PostMessageOptions): Promise<Result> {
    return new Promise((resolve, reject) => {
      this.callbacks = this.callbacks.concat({ resolve, reject });
      this.worker.postMessage(message, options);
    });
  }

  restart(): void {
    this.worker.terminate();
    this.worker = this.workerFactory();
    this.worker.addEventListener('message', this.onMessage.bind(this));
    this.worker.addEventListener('error', this.onError.bind(this));
    this.callbacks.forEach((callback) => callback?.reject(new WorkerTerminatedError()));
    this.callbacks = [];
  }

  private onMessage = (ev: MessageEvent<Result>) => {
    const [callbacks, ...rest] = this.callbacks;
    this.callbacks = rest;
    if (callbacks != null) {
      const { resolve } = callbacks;
      resolve(ev.data);
    }
  };

  private onError = (ev: ErrorEvent) => {
    const [callbacks, ...rest] = this.callbacks;
    this.callbacks = rest;
    if (callbacks != null) {
      const { reject } = callbacks;
      reject(ev.error);
    }
  };
}
