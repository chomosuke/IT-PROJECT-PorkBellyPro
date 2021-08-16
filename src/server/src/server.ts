import { ArgumentParser } from 'argparse';
import express from 'express';
import { resolve } from 'path';
import { env } from 'process';

interface IArgs {
    dist: string;
    port: number;
}

const parser = new ArgumentParser();
parser.add_argument('-d', '--dist');
parser.add_argument('-p', '--port', { type: 'int', default: env.PORT ?? 80 });

const { dist: distPath, port } = parser.parse_args() as IArgs;

const app = express();
const dist = express.static(resolve(distPath));

app.use(dist);

console.log(`Listening on port ${port}...`);
app.listen(port);
