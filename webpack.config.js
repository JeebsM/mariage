const path = require('path')

module.exports = {
    entry: {
      'common': './src/common.js',
      'main': './src/main.js',
      'gallery': './src/gallery.js',
      'journal': './src/journal.js',
      'admin': './src/admin.js',
    },
    mode: 'development',
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: './js/[name].bundle.js',
    },
    experiments: {
      topLevelAwait: true
    }
}