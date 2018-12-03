/**
 * cwd
 */
module.exports = function cwd () {
  const path = require('path');
  return path.join(__dirname, '../..');
};
