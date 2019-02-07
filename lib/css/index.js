'use strict';

/**
 * css
 */
function css () {
  const agartha = require('../../index');
  const _ = require('underscore');
  const { join, basename } = require('path');
  const appDir = require('../appDir');
  const exists = require('../exists');  
  const configurationsSource = join(appDir(), 'sass.js');
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
        file: join(appDir(), 'app/sass/style.scss'),
        outFile: join(appBuildDir(), 'css/style.css'),
        map: join(appBuildDir(), 'css/style.css.map')
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
      css = appUrl() + '/css/' + basename(defaultConfigurations.outFile);
      break;
    default:
      css = read.text(join(appBuildDir(), 'css', 'style.css'));
      break;
    }

    output += compiledTemplate({ css: css });

  });

  return output;

}

module.exports = css;