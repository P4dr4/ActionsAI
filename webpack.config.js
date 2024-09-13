const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/chatgpt2.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'chatgpt2.js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: 'node',
};
