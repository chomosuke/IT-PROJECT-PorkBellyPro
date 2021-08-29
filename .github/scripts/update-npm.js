#!/usr/bin/env node

/**
 * @file Updates the version of NPM obtained by actions/setup-node@v2.
 */

const { exec } = require('child_process');
const { dirname, resolve } = require('path');
const { chdir, exit } = require('process');

exec('which node', (err, stdout) => {
  if (err)
    exit(1);
  chdir(resolve(dirname(stdout), '..', 'lib'));
  exec('npm install npm@7.20.0', (err) => {
    if (err)
      exit(1);
  });
});
