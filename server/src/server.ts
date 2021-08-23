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
}

async function main() {
  const parser = new ArgumentParser();
  parser.add_argument('-d', '--dist');
  parser.add_argument('-c', '--conn');
  parser.add_argument('-p', '--port', { type: 'int', default: env.PORT ?? 80 });

  const { dist: distPath, conn, port } = parser.parse_args() as IArgs;

  const app = express();
  const dist = express.static(resolve(distPath));
  const db = await createConnection(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const apiRouter = new ApiRouter(db);

  app.use('/api', apiRouter.router);
  app.use(dist);

  console.log(`Listening on port ${port}...`);
  app.listen(port);
}

main().catch(console.error);
