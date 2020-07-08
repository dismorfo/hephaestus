/**
 * Log
 *
 * @param {String} path
 * @param {String} status
 * @param {Function} fn
 */
const _ = require('underscore');

const chalk = require('chalk');

function log (message, status, callback) {
  const availableStatus = {
    error: chalk.bold.red,
    warning: chalk.bold.yellow,
    ok: chalk.bold.rgb(255, 211, 0),
    build: chalk.bold.rgb(218, 120, 0),
    create: chalk.bold.magentaBright,
    babel: chalk.bold.rgb(29, 211, 0)
  };
  console.log(availableStatus[status](status), message);
  if (_.isFunction(callback)) {
    callback();
  }
}

module.exports = log;