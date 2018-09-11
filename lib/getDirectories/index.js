/**
 * getDirectories
 */
module.exports = exports = function getDirectories (dirPath) {
  const fs = require('fs')
  const path = require('path')
  return fs.readdirSync(dirPath).filter((file) => {
    return fs.statSync(path.join(dirPath, file)).isDirectory()
  })
}