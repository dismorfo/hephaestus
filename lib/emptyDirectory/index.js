/**
 * Check if the given directory `path` is empty.
 *
 * @param {String} path
 * @param {Function} fn
 */
module.exports = exports = function emptyDirectory (path, fn) {
  // https://nodejs.org/api/fs.html
  const fs = require('fs')
  const _ = require('underscore')
  fs.readdir(path, (err, files) => {
    if (err && err.code !== 'ENOENT') {
      throw err
    }
    if (_.isFunction(fn)) {
      fn(!files || !files.length)
    }
    else {
      throw new Error('No callback')
    }
  })
}
