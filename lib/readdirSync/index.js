/**
 * readdirSync
 */
module.exports = exports = function readdirSync (directory) {
  const fs = require('fs')
  return fs.readdirSync(directory)
}
