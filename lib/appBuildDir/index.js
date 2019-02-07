'use strict';

/**
 * appBuildDir
 */

function appBuildDir () {
  const path = require('path');
  const appDir = require('../appDir');
  const get = require('../get');
  const canWrite = require('../canWrite');
  const buildDir = get('appBuildDir');
  return (buildDir) ? buildDir : path.join(appDir(), 'build');
}

module.exports = appBuildDir;