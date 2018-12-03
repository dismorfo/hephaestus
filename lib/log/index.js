/**
 * Log
 *
 * @param {String} path
 * @param {String} status
 * @param {Function} fn
 */
module.exports = function log (msg, status, callback) {
  const _ = require('underscore');
  console.log('   \x1b[36m' + status + '\x1b[0m : ' + msg);
  if (_.isFunction(callback)) callback();
};
