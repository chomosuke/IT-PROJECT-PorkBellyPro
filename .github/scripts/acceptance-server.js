#!/usr/bin/env node

/**
 * @file Starts the server for acceptance testing.
 */

const { spawn } = require('child_process');
const { randomBytes } = require('crypto');
const { resolve } = require('path');

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
  ]);

  await new Promise((resolve, reject) => {
    let tries = 0;
    const callback = async () => {
      const res = await fetch(`http://localhost:${SERVER_PORT}`);
      if (res.ok) {
        resolve();
        return;
      }
      if (tries > 10) {
        reject(new Error('Server did not start in time'));
      } else {
        tries += 1;
        setTimeout(callback, 1000);
      }
    };
  });
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
