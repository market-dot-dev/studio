const { pathsToModuleNameMapper } = require('ts-jest'); // Correct import
const { compilerOptions } = require('./tsconfig.json'); // Adjust this line if your tsconfig is located elsewhere

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  },
};