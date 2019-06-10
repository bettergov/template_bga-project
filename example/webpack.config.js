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

const glob = require('glob');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PurgeCssPlugin = require('purgecss-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, 'src')
};

prodConfig = {
  optimization: {
    minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()]
  },
  plugins: [
    new PurgeCssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
      whitelistPatterns: [/^svelte-/]
    }),
    new CopyPlugin([{ from: 'src/static', to: '' }]),
    new PrerenderSPAPlugin({
      staticDir: path.join(__dirname, 'public'),
      routes: ['/']
    }),
    new CleanWebpackPlugin()
  ]
};

// final config

webpackConfig = merge(
  webpackConfig,
  require('./config')['nunjucks'],
  prod ? prodConfig : {}
);

module.exports = webpackConfig;
