module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  maxWorkers: 1,
};
