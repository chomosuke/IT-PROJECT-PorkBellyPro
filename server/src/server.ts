import { ArgumentParser } from 'argparse';
import express, { ErrorRequestHandler, RequestHandler } from 'express';
import { readFile } from 'fs/promises';
import { createConnection } from 'mongoose';
import { resolve } from 'path';
import { env } from 'process';
import { ApiRouter } from './api/api-router';
import { HttpStatusError } from './api/HttpStatusError';

interface IArgs {
  dist: string;
  conn: string;
  port: number;
  secret: string;
}

type ServeIndexRequestHandlerAsync =
  (distPath: string, ...args: Parameters<RequestHandler>) => Promise<void>;

const serveIndexAsync: ServeIndexRequestHandlerAsync = async (distPath, _req, res) => {
  const index = resolve(distPath, 'index.html');
  let file: Buffer;
  try {
    file = await readFile(index);
  } catch {
    throw new HttpStatusError(404);
  }
  res.status(200).contentType('.html').send(file);
};

function serveIndex(distPath: string): RequestHandler {
  /* eslint-disable-next-line @typescript-eslint/no-shadow */
  const serveIndex: RequestHandler = (...args) => {
    serveIndexAsync(distPath, ...args).catch(args[2]);
  };

  return serveIndex;
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err) {
    if (err instanceof HttpStatusError) {
      res.status(err.code).send(err.message);
      return;
    }
  }

  res.sendStatus(500);
};

async function main() {
  const parser = new ArgumentParser();
  parser.add_argument('-d', '--dist');
  parser.add_argument('-c', '--conn');
  parser.add_argument('-p', '--port', { type: 'int', default: env.PORT ?? 80 });
  parser.add_argument('-s', '--secret');

  const {
    dist: distPath, conn, port, secret,
  } = parser.parse_args() as IArgs;

  const secretBuffer = Buffer.from(secret, 'base64');
  if (secretBuffer.length !== 32) throw new Error('Invalid key length');

  const app = express();
  const dist = express.static(resolve(distPath));
  const db = await createConnection(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const apiRouter = new ApiRouter(secretBuffer, db);

  app.use('/api', apiRouter.router);
  app.use(dist);
  app.get('*', serveIndex(distPath));
  app.use(errorHandler);

  console.log(`Listening on port ${port}...`);
  app.listen(port);
}

main().catch(console.error);
