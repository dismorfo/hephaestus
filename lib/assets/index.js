/**
 * assets
 * we need a better name
 */

'use strict'

module.exports = exports = function assets () {
  const ncp = require('ncp').ncp
  const path = require('path')
  const appDir = require('../appDir')
  const appBuildDir = require('../appBuildDir')
  const destination = path.join(appBuildDir(), 'images')
  const source = path.join(appDir(), 'app', 'images')
  ncp.limit = 16
  ncp(source, destination, (err) => {
    if (err) return console.error(err)
  })
}
