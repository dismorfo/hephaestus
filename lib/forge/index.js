/**
 * forge
 */
module.exports = exports = function forge () {
  const assets = require('../assets')
  const sass = require('../sass')
  const build = require('../build')
  assets()
  sass()
  build()
}
