import express, { ErrorRequestHandler } from 'express';
import { agent } from 'supertest';
import { HttpStatusError } from '../../api/HttpStatusError';
import { requestLimiter } from '../../api/requestLimiter';

describe('requestLimiter tests', () => {
  const app = express();
  const catchStatusError: ErrorRequestHandler = (err, _req, res, next) => {
    if (err != null && err instanceof HttpStatusError) {
      res.status(err.code).send(err.message);
    } else {
      next(err);
    }
  };
  app.use(requestLimiter(), (_req, res) => {
    res.sendStatus(200);
  });
  app.use(catchStatusError);

  test('Success test: no content', async () => {
    await agent(app)
      .post('/')
      .expect(200);
  });

  test('Success test: with content', async () => {
    await agent(app)
      .post('/')
      .send(Buffer.allocUnsafe(1048576))
      .expect(200);
  });

  test('Fail test: content too large', async () => {
    await agent(app)
      .post('/')
      .send(Buffer.allocUnsafe(1048577))
      .expect(413);
  });
});
