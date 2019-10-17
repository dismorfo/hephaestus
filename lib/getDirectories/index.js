/**
 * getDirectories
 */
module.exports = function getDirectories (dirPath) {
  const {
    readdirSync,
    statSync
  } = require('fs');
  const {
    join
  } = require('path');
  return readdirSync(dirPath).filter(file => {
    return statSync(join(dirPath, file)).isDirectory();
  });
};