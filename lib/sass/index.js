/**
 * agartha.js
 * https://github.com/NYULibraries/agartha.js
 *
 * Copyright (c) 2014 New York University, contributors
 * Licensed under the MIT license.
 */

module.exports = exports = function sass () {
  const { agartha } = require('../../index')
  const sassy = require('../sassy')
  const path = require('path')
  const appDir = require('../appDir')
  const appUrl = require('../appUrl')
  const read = require('../read')
  const appBuildDir = require('../appBuildDir')
  const exists = require('../exists')
  const write = require('../write')
  const configurations = require('../configurations')
  const build = appBuildDir()
  const app = appDir()
  const sassConfiguration = configurations.sass()
  const outputStyle = sassConfiguration.dist.options.style  
  const stringReplacement = "asset-base: '" + appUrl() + "';"
  const re = /asset-base: '.*';/gi
  let sassVariable = null
  
  if (exists(path.join(appDir(), 'app/sass', '_bootstrap-variables.scss'))) {
    sassVariable = read.text(path.join(appDir(), 'app/sass', '_bootstrap-variables.scss'))
    sassVariable = sassVariable.replace(re, stringReplacement)
  }

  let baseResult = sassy.renderSync({
    file: path.join(app, 'app/sass/style.scss'),
    outputStyle: outputStyle,
    outFile: path.join(build, 'css/base.css'),
    sourceMap: true
  })

  let siteResult = sassy.renderSync({
    file: path.join(app, 'app/sass/style.scss'),
    outputStyle: outputStyle,
    outFile: path.join(build, 'css/site.css'),
    sourceMap: true
  })
  
  // Base SASS files from the relic
  write(path.join(build, 'css/base.css'), baseResult.css.toString())    

  // Leave behind a map
  write(path.join(build, 'css/base.css.map'), baseResult.map.toString())    

  // Site specific SASS files
  write(path.join(build, 'css/site.css'), siteResult.css.toString())

  // Site specific map
  write(path.join(build, 'css/site.css.map'), siteResult.map.toString())

  write(path.join(build, 'css/style.css'), baseResult.css.toString() + ' ' + siteResult.css.toString())

}
