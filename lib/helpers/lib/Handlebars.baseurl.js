const {
  appUrl, 
  get
} = require('hephaestus');

/**
 * Expose helper
 */
module.exports = function (str) {
  let baseurl = appUrl();
  if (typeof str === 'string' || str instanceof String) {
    return `${baseurl}/${str.replace(/^\//, '')}`;
  } else {
    if (!baseurl.length) {
      return '/';
    } else {
      return baseurl;
    }
  }
}
