/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  roots: [
    'src/'
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/__tests__/__acceptance__/common.ts$'
  ],
  testRegex: "(/__tests__/__acceptance__/.*)",
};
