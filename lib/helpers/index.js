'use strict';

/**
 * Register Handlebars helpers provided by Hephaestus and app
 */
function helpers () {
  const { resolve } = require('path'); 
  const _ = require('underscore');
  const appDir = require('../appDir');
  const exists = require('../exists');
  const readdirSync = require('../readdirSync');
  const helpersDir = resolve(appDir(), 'app/helpers');
  const regex = RegExp('^Handlebars.(.*).js$');
  let helpers = {};
  /**
   * read default helpers available hephaestus/lib/helpers/lib/Handlebars.*.js
   */
  _.each(readdirSync(resolve(__dirname, 'lib')), helper => {
    const found = regex.exec(helper);
    if (found) {
      helpers[found[1]] = require(resolve(__dirname, 'lib', helper));
    }
  });
  /**
   * if exists, read helpers provided by app app/helpers/Handlebars.*.js
   */
  if (exists(helpersDir)) {
    _.each(readdirSync(helpersDir), helper => {
      const found = regex.exec(helper);
      if (found) {
        helpers[found[1]] = require(resolve(helpersDir, helper));
      }
    });
  }
  return helpers;  
}

module.exports = helpers;
