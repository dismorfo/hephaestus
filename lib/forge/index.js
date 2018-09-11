/**
 * forge
 */
module.exports = exports = function forge () {
  const transform = require('../transform')
        transform.assets()
        transform.sass()
        transform.build()
}