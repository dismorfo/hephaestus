/**
 * canWrite
 *
 * @param {String} filePath
 */
module.exports = function exists (filePath) {
  const fs = require('fs');
  try {
    fs.accessSync(filePath, fs.F_OK);
    return true;
  }
  catch (e) {
    return false;
  }
};
