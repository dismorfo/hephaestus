/**
 * htaccess
 */
module.exports = function htaccess (data) {
  return;
  const fs = require('fs');
  let rewriteBaseTemplate = Handlebars.compile(agartha.read.text(agartha.path.join(agartha.cwd(), 'app/shared/views/htaccess.hbs')));
  let rewriteBasePath = source.appRoot + route.replace('/index.html', '');
  let htaccessFilename = agartha.appBuildDir() + route.replace('/index.html', '') + '/.htaccess';
  /** write .htaccess file */
  if (rewriteBasePath) {
    agartha.write(htaccessFilename, rewriteBaseTemplate({ rewriteBase: rewriteBasePath }));
  }
};
