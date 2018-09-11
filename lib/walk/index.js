/**
 * walk
 */
module.exports = exports = function walk (dir, page) {
  // https://nodejs.org/api/fs.html
  const fs = require('fs')
  const path = require('path')
  const log = require('../log')
  let results = []
  try {
    if (fs.lstatSync(dir).isDirectory()) {
      fs.readdirSync(dir).forEach((file) => {
        results[file] = path.join(dir, file)
      })
    }
  }
  catch (err) {
    log('Error listing directory ' + dir, 'error')
  }
  return results
}