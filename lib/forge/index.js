'use strict';

/**
 * forge
 */
function forge () {
  return new Promise(async (resolve, reject) => {
    const copyAssets = require('../assets');
    const sass = require('../sass');
    const { build } = require('../build');
    try {
      await copyAssets(['images']);
      await sass();
      await build();
      resolve();
    }
    catch (error) {
      reject(error);
    }
  });
}

module.exports = forge;
