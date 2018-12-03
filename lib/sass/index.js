/**
 * hephaestus.js
 * https://github.com/dismorfo/hephaestus.js
 */
module.exports = function sass () {
  const fs = require('fs');
  const sassy = require('../sassy');
  const _ = require('underscore');
  const path = require('path');
  const appDir = require('../appDir');
  const appBuildDir = require('../appBuildDir');
  const write = require('../write');
  const exists = require('../exists');
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
        build: 'external', // options: inline,  external
        outputStyle: 'expanded', // options: nested, expanded, compact, compressed
        sourceMap: true
      }
    ];
  }

  // make this so that it read a JS file for SASS functions
  let functions = {};

  fs.readdirSync(path.join(__dirname, 'sassFunctions')).forEach((sassFunction) => {
    functions[sassFunction] = require(path.join(__dirname, 'sassFunctions', sassFunction));
  });

  _.each(configurations, (configuration) => {
    let defaultConfigurations = {
      omit: false,
      sourceMap: true,
      build: 'external', // options: inline,  external
      outputStyle: 'compressed' // options: nested, expanded, compact, compressed
    };
    _.extend(defaultConfigurations, configuration);
    const sassResult = sassy.renderSync({
      file: defaultConfigurations.file,
      outputStyle: defaultConfigurations.outputStyle,
      outFile: defaultConfigurations.outFile,
      sourceMap: defaultConfigurations.sourceMap,
      functions: functions
    });
    // write css
    write(defaultConfigurations.outFile, sassResult.css.toString());
    if (defaultConfigurations.sourceMap) {
      // write map
      write(defaultConfigurations.map, sassResult.map.toString());
    }
  });
};
