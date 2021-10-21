#!/usr/bin/env node

/**
 * @file Starts the server for acceptance testing.
 */

const { spawn } = require('child_process');
const { randomBytes } = require('crypto');
const { request } = require('http');
const { resolve } = require('path');
const { exit } = require('process');

(async () => {
  const { DB_PORT, SERVER_PORT } = process.env;
  const secret = randomBytes(32).toString('base64');

  spawn(process.execPath, [
    resolve(__dirname, '../../server/bin/server.js'),
    '-d',
    'dist',
    '-c',
    `mongodb://localhost:${DB_PORT}/acceptance`,
    '-s',
    secret,
    '-p',
    SERVER_PORT,
  ], {
    detached: true,
    env: {
      NODE_ENV: 'test',
    }
  });

  await new Promise((resolve, reject) => {
    let tries = 0;
    let callback;
    const getCallback = () => callback;

    callback = () => {
      const retry = () => {
        console.log('Retrying');
        if (tries >= 10) {
          reject(new Error('Server did not start in time'));
        } else {
          tries += 1;
          setTimeout(getCallback(), 5000);
        }
      };

      const req = request(`http://localhost:${SERVER_PORT}`, { timeout: 5000 });
      req.addListener('response', () => resolve());
      req.addListener('timeout', retry);
      req.addListener('error', retry);
      req.end();
    };

    callback();
  });

  exit(0);
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
