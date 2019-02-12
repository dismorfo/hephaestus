/**
 * Log
 *
 * @param {String} path
 * @param {String} status
 * @param {Function} fn
 */
function log (message, status, callback) {
  const _ = require('underscore');
  const chalk = require('chalk');

  const availableStatus = {
    error: chalk.bold.red,
    warning: chalk.bold.yellow,
    ok: chalk.bold.green,
    build: chalk.bold.green,
    create: chalk.bold.magentaBright,
  };

  console.log(availableStatus[status](status), message);

  if (_.isFunction(callback)) {
    callback();
  }

}

module.exports = log;