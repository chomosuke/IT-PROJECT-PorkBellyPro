#!/usr/bin/env node
//@ts-check

'use strict';

import { ArgumentParser } from 'argparse';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { dirname, resolve } from 'path';
import { fileURLToPath, URL } from 'url';
import webpack from 'webpack';

const parser = new ArgumentParser();
parser.add_argument('-o', '--out');
parser.add_argument('-t', '--title');
parser.add_argument('-d', '--dev', { action: 'store_true' })

/** @type {{out: string; title: string; dev: boolean;}} */
const args = parser.parse_args();

/** @param rel {string} */
/** @returns {string} */
function src(rel) {
  //@ts-expect-error
  return resolve(dirname(fileURLToPath(new URL(import.meta.url))), 'src', rel);
}

webpack({
  mode: args.dev ? 'development' : 'production',
  devtool: 'source-map',
  entry: src('main.tsx'),
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.ts',
      '.tsx'
    ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  },
  output: {
    path: resolve(args.out)
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: args.title
    })
  ]
}, /** @param err {any} */(err, stats) => {

  // https://webpack.js.org/api/node/#error-handling
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  console.log(stats.toString({ colors: true, errorDetails: true }));
});
