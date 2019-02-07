'use strict';

/**
 * forge
 */
async function forge () {
  const copyAssets = require('../assets');
  const sass = require('../sass');
  const { build } = require('../build');
  await copyAssets(['images']);
  await sass();
  await build();
}

module.exports = forge;
