const path = require('path');
const NunjucksWebpackPlugin = require('nunjucks-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nunjucks = require('nunjucks');
const nunjucksSettings = require('./nunjucks-settings');
const nunjucksContext = require('./nunjucks-context');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const env = nunjucks.configure('./src/templates/', {
  autoescape: true,
  watch: true
});
env.addFilter('markdown', nunjucksSettings.markdownFilter);
env.addGlobal('getArtClasses', nunjucksSettings.getArtClasses);
env.addFilter('attribute', nunjucksSettings.attrFilter);
env.addFilter('type', nunjucksSettings.typeFilter);
env.addGlobal('getArtFromData', nunjucksSettings.getArtFromData);

const ctx = nunjucksContext.getContext();

module.exports = {
  entry: {
    bundle: path.resolve(__dirname, 'src/js/main.js')
  },
  resolve: {
    extensions: ['*', '.mjs', '.js', '.svelte']
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
    chunkFilename: '[name].[id].js'
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
            hotReload: true
          }
        }
      },
      {
        test: /\.s?css$/,
        use: [
          /**
           * MiniCssExtractPlugin doesn't support HMR.
           * For developing, use 'style-loader' instead.
           * */
          prod ? MiniCssExtractPlugin.loader : 'style-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  mode,
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new NunjucksWebpackPlugin({
      templates: [
        {
          from: path.resolve(__dirname, 'src/templates/index.njk'),
          to: 'index.html',
          context: ctx
        }
      ],
      configure: env
    })
  ],
  devtool: prod ? false : 'source-map'
};
