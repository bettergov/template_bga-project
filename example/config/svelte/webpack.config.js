module.exports = {
  resolve: {
    extensions: ['.mjs', '.js', '.svelte']
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
      }
    ]
  }
};
