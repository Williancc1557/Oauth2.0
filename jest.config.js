/* eslint-disable */

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  roots: ['<rootDir>/tests'],
  testEnvironment: "node",
  preset: "@shelf/jest-mongodb",
  collectCoverageFrom: ['<rootDir>/tests/**/*.ts'],
  coverageDirectory: 'coverage',
  transform: {
    ".+\\.ts$": "ts-jest",
  },
};