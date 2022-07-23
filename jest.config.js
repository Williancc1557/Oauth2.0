/* eslint-disable */

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  roots: ['<rootDir>/src'],
  testEnvironment: "node",
  preset: "@shelf/jest-mongodb",
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  transform: {
    ".+\\.ts$": "ts-jest",
  },
};