/**
 * Write string to specified filename (Promise).
 * 
 * @kind function
 * @param {String} filename - Absolute path (destination filename) of the copy operation. 
 * @param {String} data - String to write to file.
 * @param {requestCallback} [cb=Function.prototype]  - The callback that handles the response.
 * @example <caption>Save text 'Text to be saved' to file /content/myNewFile.txt</caption>
 * write('/content/myNewFile.txt', 'Text to be saved in /content/myNewFile.txt');
 */
function write (filename = null, data = '', cb = Function.prototype) {
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

    if (!filename) {
      return reject('Filename can not be empty.');
    }
    
    const dir = dirname(filename);
    
    if (!exists(dir)) {
      mkdirp(dir, err => {
        if (err) {
          console.error(err);
        }
        else {
          try {
            writeFile(filename, data, 'utf8', () => {
              resolve(
                log(filename, 'create', cb)
              );
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
        writeFile(filename, data, 'utf8', () => {
          resolve(log(filename, 'create', cb));
        });
      }
      catch (error) {
        reject(console.error(error));
      }
    }
  });
};

module.exports = write;
