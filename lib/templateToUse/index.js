/**
 * templateToUse
 */
function templateToUse (source) {
  'use strict';
  const { join } = require('path');
  const appDir = require('../appDir');
  const exists = require('../exists');
  const baseTemplateFilename = 'index.hbs';
  let template = null;
  // 1) Current module      
  template = join(source.current, baseTemplateFilename);
  if (exists(template)) {
    return template;
  }
  // 2) Current site shared resources
  template = join(appDir(), 'app/partials', baseTemplateFilename);
  if (exists(template)) {
    return template;
  }
  // 3) Fail
  return false;
}

module.exports = templateToUse;
