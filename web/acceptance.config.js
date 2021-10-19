/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  roots: [
    'src/'
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: "(/__tests__/__acceptance__/.*)",
  testPathIgnorePatterns: [
    'src/__tests__/(.*\.)?helpers.[jt]sx?$',
  ],
};
