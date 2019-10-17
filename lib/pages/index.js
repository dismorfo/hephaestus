/**
 * pages
 */
module.exports = function pages () {
  const {
    join
  } = require('path');
  const appDir = require('../appDir');
  const exists = require('../exists');
  const walk = require('../walk');
  var dir = join(appDir(), 'app', 'pages');
  if (!exists(dir)) return [];
  return walk(dir);
};
