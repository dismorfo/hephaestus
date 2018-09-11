/**
 * appBuildDir
 */
module.exports = exports = function appBuildDir () {
  const path = require('path')
  const appDir = require('../appDir')
  return path.join(appDir(), 'build')
}