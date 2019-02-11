'use strict';

module.exports = function() {
  const sass = require('node-sass');
  const { appUrl } = require('hephaestus');
  return new sass.types.String(appUrl() + '/');
};
