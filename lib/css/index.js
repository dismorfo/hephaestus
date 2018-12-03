/**
 * css
 */
module.exports = function css () {
  const agartha = require('../../index');
  const _ = require('underscore');
  const path = require('path');
  const appDir = require('../appDir');
  const exists = require('../exists');  
  const configurationsSource = path.join(appDir(), 'sass.js');
  const appUrl = require('../appUrl');
  const read = require('../read');
  const appBuildDir = require('../appBuildDir');
  let css = '';
  let templateString = '';
  let compiledTemplate;
  let output = '';
  let configurations = {};

  if (exists(configurationsSource)) {
    configurations = require(configurationsSource);
  }
  // default SASS configuration
  else {
    configurations = [
      {
        file: path.join(appDir(), 'app/sass/style.scss'),
        outFile: path.join(appBuildDir(), 'css/style.css'),
        map: path.join(appBuildDir(), 'css/style.css.map')
      }
    ];
  }

  _.each(configurations, (configuration) => {

    let defaultConfigurations = {
      omit: false,
      sourceMap: true,
      build: 'external', // options: inline,  external
      outputStyle: 'compressed' // options: nested, expanded, compact, compressed
    };

    _.extend(defaultConfigurations, configuration);

    if (defaultConfigurations.omit) return;

    switch (defaultConfigurations.build) {
    case 'inline':
      templateString = '<style><%= css %></style>'; 
      break;
    default:
      templateString = '<link href="<%= css %>" rel="stylesheet" type="text/css">';
      break;
    }

    compiledTemplate = _.template(templateString);

    // add test to check the assumptiont that style.css already exists
    switch (defaultConfigurations.build) {
    case 'external':
      css = appUrl() + '/css/' + path.basename(defaultConfigurations.outFile);
      break;
    default:
      css = read.text(path.join(appBuildDir(), 'css', 'style.css'));
      break;
    }

    output += compiledTemplate({ css: css });

  });

  return output;

};
