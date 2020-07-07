/**
 * Write string to specified filename.
 * 
 * @kind function
 * @param {String} filename - Absolute path (destination filename) of the copy operation. 
 * @param {String} data - String to write to file.
 * @param {requestCallback} [cb=Function.prototype]  - The callback that handles the response.
 * @example <caption>Save text 'Text to be saved' to file /content/myNewFile.txt</caption>
 * write('/content/myNewFile.txt', 'Text to be saved in /content/myNewFile.txt');
 */
async function write (filename = null, data = '', cb = Function.prototype) {

  const {
    mkdirSync, writeFileSync
  } = require('fs');

  const {
    dirname
  } = require('path');
    
  const log = require('../log');
    
  const exists = require('../exists');

  if (!filename) {
    log('Filename can not be empty.', 'error');
    process.exit(1);
  }

  if (!exists(filename)) {
    mkdirSync(dirname(filename), { recursive: true });
    try {
      writeFileSync(filename, data, 'utf8');
      log(filename, 'create', cb);
    }
    catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
};

module.exports = write;
