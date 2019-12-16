/**
 * Return the appUrl (remove trailing slash in a URL)
 * 
 * @returns {string}
 */
module.exports = function appUrl () {
  const get = require('../get');
  let appUrl = get('appUrl');
  if (appUrl) {
    appUrl = appUrl.trim();
    if (appUrl.endsWith('/')) {
      return appUrl.substring(0, appUrl.length - 1);
    } else {
      return appUrl;
    }
  }
  else {
    return '';
  }
};
