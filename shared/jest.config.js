/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  roots: [
    'src/'
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    'src/__tests__/(.*\.)?helpers.[jt]sx?$'
  ],
};
