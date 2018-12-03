/**
 * templateToUse
 */
module.exports = function templateToUse (source) {
  'use strict';
  const path = require('path');
  const appDir = require('../appDir');
  const exists = require('../exists');
  const relicDir = require('../relicDir');
  const baseTemplateFilename = 'index.hbs';
  let template = null;
  
  // 1) Current module      
  template = path.join(source.current, baseTemplateFilename);
  if (exists(template)) {
    return template;
  }
  // 2) Current site shared resources
  template = path.join(appDir(), 'app/partials', baseTemplateFilename);
  if (exists(template)) {
    return template;
  }
  // 3) Fail
  return false;
};
