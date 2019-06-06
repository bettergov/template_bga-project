const path = require('path');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

let webpackConfig = {
  entry: {
    bundle: path.resolve(__dirname, 'src/js/main.js')
  },
  resolve: {
    // extensions: ['*', '.mjs', '.js', '.svelte']
    extensions: ['*', '.js']
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].[hash].js'
  },
  module: {
    rules: [
      // {
      //   test: /\.svelte$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'svelte-loader',
      //     options: {
      //       emitCss: true,
      //       hotReload: true
      //     }
      //   }
      // },
      {
        test: /\.s?css$/,
        use: [
          /**
           * MiniCssExtractPlugin doesn't support HMR.
           * For developing, use 'style-loader' instead.
           * */
          prod ? MiniCssExtractPlugin.loader : 'style-loader?sourceMap',
          'css-loader?importLoaders,sourceMap',
          'postcss-loader?sourceMap',
          'sass-loader?sourceMap'
        ]
      }
    ]
  },
  mode,
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css'
    })
  ],
  devtool: prod ? false : 'inline-cheap-source-map'
};

// prod options

const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

prodConfig = {
  optimization: {
    minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()]
  }
};

// final config

webpackConfig = merge(
  webpackConfig,
  require('./config')[('nunjucks', 'svelte')],
  prod ? prodConfig : {}
);

module.exports = webpackConfig;
