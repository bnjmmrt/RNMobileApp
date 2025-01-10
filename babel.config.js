module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@images': './src/assets/images',
          '@button': './src/component/Button',
          '@dimensions': './src/utils/dimensions',
          "string-constants": '.src/utils/constants', 
        },
      },
    ],
  ],
  plugins: ['react-native-reanimated/plugin']
};