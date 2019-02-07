/**
 * cwd
 */
module.exports = function cwd () {
  const { join } = require('path');
  return join(__dirname, '../..');
};
