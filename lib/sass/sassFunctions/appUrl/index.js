'use strict'

module.exports = exports = function() {
  const sass = require('node-sass');
  const agartha = process.agartha;
  return new sass.types.String(agartha.appUrl() + '/');
}
