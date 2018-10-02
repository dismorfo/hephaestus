/**
 * pages
 */
module.exports = exports = function pages () {
  const path = require('path')
  const appDir = require('../appDir')
  const exists = require('../exists')
  const walk = require('../walk')
  var dir = path.join(appDir(), 'app', 'pages')
  if (!exists(dir)) return []
  return walk(dir)
}
