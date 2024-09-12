const path = require('path');

module.exports = {
  entry: './src/chatgpt2.ts',  // Entry point of your TypeScript file
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
    filename: 'chatgpt2.js',  // Output filename
    path: path.resolve(__dirname, 'dist'),  // Output directory
  },
  target: 'node',  // Specify the target environment (Node.js)
};
