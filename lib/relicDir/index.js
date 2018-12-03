/**
 * relicDir
 */
module.exports = function relicDir () {
  const path = require('path');
  const cwd = require('../cwd');
  const get = require('../get');
  return path.join(cwd(), 'app/relics', get('relic'));
};
