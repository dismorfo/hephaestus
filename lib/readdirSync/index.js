/**
 * readdirSync
 */
module.exports = function readdirSync (directory) {
  const fs = require('fs');
  return fs.readdirSync(directory);
};
