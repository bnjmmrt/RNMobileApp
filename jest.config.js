module.exports = {
  preset: 'react-native',
  maxWorkers: 2, // Limit workers to avoid process failures
  cacheDirectory: './jest/cache', // Custom cache directory
  clearMocks: true,
  testEnvironment: 'node',
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native)/)',
  ],
};
