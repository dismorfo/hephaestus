/**
 * cwd
 * returns agartha cwd
 */
module.exports = exports = function cwd() {
  const path = require('path')
  return path.join(__dirname, '../..')
 }
