/**
 * hephaestus.js
 * https://github.com/dismorfo/hephaestus.js
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
  const sassConfiguration = configurations.sass()
  const outputStyle = sassConfiguration.dist.options.style

  // const stringReplacement = "asset-base: '" + appUrl() + "';"
  // const re = /asset-base: '.*';/gi
  // let sassVariable = null
  // if (exists(path.join(appDir(), 'app/sass', '_bootstrap-variables.scss'))) {
  //   sassVariable = read.text(path.join(appDir(), 'app/sass', '_bootstrap-variables.scss'))
  //   sassVariable = sassVariable.replace(re, stringReplacement)
  // }

  let siteResult = sassy.renderSync({
    file: path.join(appDir(), 'app/sass/style.scss'),
    outputStyle: outputStyle,
    outFile: path.join(build, 'css/site.css'),
    sourceMap: true
  })

  // Site specific SASS files
  write(path.join(build, 'css/style.css'), siteResult.css.toString())

  // Site specific map
  write(path.join(build, 'css/style.css.map'), siteResult.map.toString())

}
