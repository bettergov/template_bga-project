const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

let webpackConfig = {
  entry: {
    bundle: path.resolve(__dirname, 'src/js/main.js')
  },
  resolve: {
    extensions: ['*', '.mjs', '.js', '.svelte']
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].[hash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          /**
           * MiniCssExtractPlugin doesn't support HMR.
           * For developing, use 'style-loader' instead.
           * */
          prod ? MiniCssExtractPlugin.loader : 'style-loader?sourceMap',
          prod ? 'css-loader' : 'css-loader?importLoaders,sourceMap',
          prod ? 'postcss-loader' : 'postcss-loader?sourceMap',
          prod ? 'sass-loader' : 'sass-loader?sourceMap'
        ]
      },
      {
        test: /\.svelte$/,
        exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
            hotReload: prod ? false : true
          }
        }
      }
    ]
  },
  mode,
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css'
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/) // ignore moment locales
  ],
  devtool: prod ? false : 'inline-cheap-source-map'
};

// prod options

const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

prodConfig = {
  optimization: {
    minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()]
  }
  // plugins: [new BundleAnalyzerPlugin()]
};

// final config

webpackConfig = merge(
  webpackConfig,
  require('./config')['nunjucks'],
  prod ? prodConfig : {}
);

module.exports = webpackConfig;
