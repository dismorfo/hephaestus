/**
 * readdirSync
 */
module.exports = function readdirSync (directory) {
  const {
    readdirSync
  } = require('fs');
  return readdirSync(directory);
};
