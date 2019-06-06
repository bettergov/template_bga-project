const path = require('path');
const nunjucks = require('nunjucks');
const nunjucksSettings = require('./settings');
const nunjucksContext = require('./context');
const NunjucksWebpackPlugin = require('nunjucks-webpack-plugin');

const env = nunjucks.configure('./src/templates/', {
  autoescape: true,
  lstripBlocks: true,
  trimBlocks: true
});
env.addFilter('markdown', nunjucksSettings.markdownFilter);
env.addGlobal('getArtClasses', nunjucksSettings.getArtClasses);
env.addFilter('attribute', nunjucksSettings.attrFilter);
env.addFilter('type', nunjucksSettings.typeFilter);
env.addGlobal('getArtFromData', nunjucksSettings.getArtFromData);

const ctx = nunjucksContext.getContext();

module.exports = {
  plugins: [
    new NunjucksWebpackPlugin({
      templates: [
        {
          from: path.resolve(__dirname, '../../src/templates/index.njk'),
          to: 'index.html',
          context: ctx
        }
      ],
      configure: env
    })
  ]
};
