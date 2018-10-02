/**
 * agartha.js
 * https://github.com/NYULibraries/agartha.js
 *
 * Copyright (c) 2014 New York University, contributors
 * Licensed under the MIT license.
 */

module.exports = exports = function css () {
  const { agartha } = require('../../index')
  const _ = require('underscore')
  const path = require('path')
  const configurations = require('../configurations')
  const get = require('../get')
  const appUrl = require('../appUrl')
  const read = require('../read')
  const appBuildDir = require('../appBuildDir')
  let css = ''
  let templateString = ''
  let compiledTemplate
  let output = ''
  let sassConfigurations = configurations.sass()
  let build = sassConfigurations.dist.build
  switch (build) {
    case 'inline':
      templateString = '<style><%= css %></style>'
      break
    default:
      templateString = '<link href="<%= css %>" rel="stylesheet" type="text/css">'
      break
  }
  compiledTemplate = _.template(templateString)
  // add test to check the assumptiont that style.css already exists
  switch (build) {
    case 'external' :
      css = appUrl() + '/css/style.css'
      break
    default:
      css = read.text(path.join(appBuildDir(), 'css', 'style.css'))
      break
  }
  output += compiledTemplate({ css: css })
  return output
}
