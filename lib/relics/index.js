/**
 * relics
 */
module.exports = exports = function relics () {
  const path = require('path')
  const cwd = require('../cwd')
  const readdirSync = require('../readdirSync')
  return readdirSync(path.join(cwd(), 'app/relics'))
}
