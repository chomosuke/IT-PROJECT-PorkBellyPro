import { ArgumentParser } from 'argparse';
import express from 'express';
import { createConnection } from 'mongoose';
import { resolve } from 'path';
import { env } from 'process';
import { ApiRouter } from './api/api-router';

interface IArgs {
  dist: string;
  conn: string;
  port: number;
  secret: string;
}

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

  console.log(`Listening on port ${port}...`);
  app.listen(port);
}

main().catch(console.error);
