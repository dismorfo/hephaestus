/**
 * assets
 * we need a better name
 */
'use strict';

module.exports = function assets(list = []) {
  const { ncp } = require('ncp');
  const { resolve } = require('path');
  const _ = require('underscore');
  const appDir = require('../appDir');
  const exists = require('../exists');
  const appBuildDir = require('../appBuildDir');
  if (exists(`${appDir()}/app/fonts`)) {
    list.push('fonts');
  }
  if (exists(`${appDir()}/app/images`)) {
    list.push('images');
  }
  _.each(list, item => {
    const destination = resolve(appBuildDir(), item);
    const source = resolve(appDir(), 'app', item);
    if (exists(source)) {
      ncp(source, destination, err => {
        if (err) return console.error(err);
      });
    }
  });
};
