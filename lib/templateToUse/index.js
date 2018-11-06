/**
 * templateToUse
 */
module.exports = exports = function templateToUse (source) {
  'use strict'
  const { agartha } = require('../../index')
  const path = require('path')
  const appDir = require('../appDir')
  const exists = require('../exists')
  const relicDir = require('../relicDir')
  const baseTemplateFilename = 'index.hbs'
  let template = null
  
  // 1) Current module      
  template = path.join(source.current, baseTemplateFilename)

  if (exists(template)) {
    return template
  }
  // 2) Current site shared resources
  template = path.join(appDir(), 'app/partials', baseTemplateFilename)
  if (exists(template)) {
    return template
  }
  // 3) Base module
  template = path.join(source.base, baseTemplateFilename)
  if (exists(template)) {
    return template
  }
  // 4) Relic shared resources
  template = path.join(relicDir(), 'partials', baseTemplateFilename)
  if (exists(template)) {
    return template
  }
  // 5) Fail
  return false
}
