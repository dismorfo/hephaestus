/**
 * exit
 */
module.exports = function exit (error) {
  const log = require('../log');
  log(error, 'critical');
  process.exit(1);
};
