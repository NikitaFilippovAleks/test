const globImporter = require('node-sass-glob-importer');

const CopyWebpackPlugin = require('copy-webpack-plugin');

new CopyWebpackPlugin({
  patterns: [
    // Copy client translation files to build folder
    { from: 'engines/client/app/frontend/locales/translations', to: 'locales/client' },
  ],
})
