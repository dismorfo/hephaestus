'use strict';

module.exports = function() {
  const sass = require('node-sass');
  const agartha = require('hephaestus');
  return new sass.types.String(agartha.appUrl() + '/');
};
