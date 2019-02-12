/**
 * canWrite
 *
 * @param {String} targetPath
 */
module.exports = function canWrite (targetPath) {
  const { stat, access, W_OK } = require('fs');
  return new Promise((resolve, reject) => {
    stat(targetPath, (err) => {
      if (err) {
        reject(err);
      }
      else {
        access(targetPath, W_OK, err => {
          if (err) {
            reject(err);
          }
          else {
            resolve(true);
          }
        });
      }
    });
  });
};