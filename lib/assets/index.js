/**
 * assets
 * we need a better name
 */
'use strict'

module.exports = exports = function assets ( list ) {
  const { ncp } = require('ncp')
  const path = require('path')
  const _ = require('underscore')
  const appDir = require('../appDir')
  const exists = require('../exists')
  const appBuildDir = require('../appBuildDir')
  _.each(list, (item) => {
    const destination = path.join(appBuildDir(), item)
    const source = path.join(appDir(), 'app', item)
    if (exists(source)) {
      ncp(source, destination, (err) => {
        if (err) return console.error(err)
      })
    }
  })
}
