/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
  */
module.exports = function mkdir (path, fn) {
  const mkdirp = require('mkdirp');
  const log = require('../log');
  mkdirp(path, '0775', (err) => {
    if (err) throw err;
    log(path, 'create');
    fn && fn();
  });
};
