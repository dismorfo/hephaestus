/**
 * hephaestus.js
 * https://github.com/dismorfo/hephaestus.js
 */
module.exports = exports = function sass () {
  const { agartha } = require('../../index');
  const sassy = require('../sassy');
  const _ = require('underscore');
  const path = require('path');
  const appDir = require('../appDir');
  const appUrl = require('../appUrl');
  const appBuildDir = require('../appBuildDir');
  const write = require('../write');
  const exists = require('../exists');
  const read = require('../read');
  const source = path.join(appDir(), 'sass.js');
  const build = appBuildDir();
  let configurations = {};
  if (exists(source)) {
    configurations = require(source);
  }
  // default SASS configuration
  else {
    configurations = [
      {
        file: path.join(appDir(), 'app/sass/style.scss'),
        outFile: path.join(build, 'css/style.css'),
        map: path.join(build, 'css/style.css.map'),
        build: 'external', // opt ions: inline,  external
        outputStyle: "expanded", // options: nested, expanded, compact, compressed
        sourceMap: true
      }
    ]
  }

  // make this so that it read a JS file for SASS functions
  let functions = {
    'appUrl()' : function() {
      return new sassy.types.String(appUrl() + '/');
    }
  };
  
  console.log(configurations)

  // _.each(configurations, (element) => {
  //  console.log(element)
  // })

  let siteResult = sassy.renderSync({
    file: configurations.sass.entrypoint,
    outputStyle: configurations.sass.options.style,
    outFile: configurations.sass.outFile,
    sourceMap: configurations.sass.options.sourceMap,
    functions: functions
  });

  // Site specific SASS files
  write(configurations.sass.outFile, siteResult.css.toString());

  // Site specific map
   write(configurations.sass.options.map, siteResult.map.toString());

}
