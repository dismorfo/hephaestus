/**
 * forge
 */
module.exports = function forge () {
  const copyAssets = require('../assets');
  const sass = require('../sass');
  const build = require('../build');
  copyAssets(['images']);
  sass();
  build();
};
