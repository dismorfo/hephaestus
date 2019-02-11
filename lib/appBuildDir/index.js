'use strict';

/**
 * appBuildDir
 */

function appBuildDir () {
  const { join } = require('path');
  const appDir = require('../appDir');
  const get = require('../get');
  const buildDir = get('appBuildDir');
  return (buildDir) ? buildDir : join(appDir(), 'build');
}

module.exports = appBuildDir;