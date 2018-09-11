/**
 * echo str > path.
 *
 * @param {String} path
 * @param {String} str
 */
module.exports = exports = function write (filename, str, mode, callback) {
  const fs = require('fs')
  const path = require('path')
  // https://github.com/substack/node-mkdirp
  const mkdirp = require('mkdirp')
  const log = require('../log')
  const exists = require('../exists')
  const dirname = path.dirname(filename)
  if (!exists(dirname)) {
    mkdirp(dirname, (err) => {
      if (err) console.error(err)
      else {
        try {
          fs.writeFile(filename, str, 'utf8', () => {
            log(filename, 'create', callback)
          })
        }
        catch (error) {
          console.error(error)
        }
      }
    })
  }
  else {
    try {
      fs.writeFile(filename, str, 'utf8', () => {
        log(filename, 'create', callback)
      })
    }
    catch (error) {
      console.error(error)
    }
  }
}