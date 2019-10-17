/**
 * echo str > path.
 *
 * @param {String} path
 * @param {String} str
 */
module.exports = function write (filename, str, mode, callback) {
  return new Promise(async (resolve, reject) => {
    
    const {
      writeFile
    } = require('fs');

    const {
      dirname
    } = require('path');

    // https://github.com/substack/node-mkdirp
    const mkdirp = require('mkdirp');
    
    const log = require('../log');
    
    const exists = require('../exists');
    
    const dir = dirname(filename);
    
    if (!exists(dir)) {
      mkdirp(dir, err => {
        if (err) {
          console.error(err);
        }
        else {
          try {
            writeFile(filename, str, 'utf8', () => {
              resolve(log(filename, 'create', callback));
            });
          }
          catch (error) {
            reject(console.error(error));
          }
        }
      });
    }
    else {
      try {
        writeFile(filename, str, 'utf8', () => {
          resolve(log(filename, 'create', callback));
        });
      }
      catch (error) {
        reject(console.error(error));
      }
    }
  });
};