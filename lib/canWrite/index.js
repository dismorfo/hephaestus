/**
 * canWrite
 *
 * @param {String} targetPath
 */
module.exports = exports = function canWrite (targetPath) {
  const fs = require('fs')
  return new Promise((resolve, reject) => {
    fs.stat(targetPath, (err) => {
      if (err) reject(err)
      else {
        fs.access(targetPath, fs.W_OK, (err) => {
          if (err) reject(err)
          else {
            resolve(true)
          }
        })
      }
    })
  })
}