/**
 * walk
 */
module.exports = function walk (dir) {
  // https://nodejs.org/api/fs.html
  const {
    lstatSync,
    readdirSync
  } = require('fs');
  
  const {
    join
  } = require('path');

  const log = require('../log');

  let results = [];

  try {
    if (lstatSync(dir).isDirectory()) {
      readdirSync(dir).forEach(file => {
        results[file] = join(dir, file);
      });
    }
  }
  catch (err) {
    log(`Error listing directory ${dir}`, 'error');
  }
  return results;
};
