/**
 * sass/index.js
 */
function sass () {
  return new Promise(async (resolve, reject) => {
    const fs = require('fs');
    const sassy = require('../sassy');
    const _ = require('underscore');
    const { join } = require('path');
    const appDir = require('../appDir');
    const appBuildDir = require('../appBuildDir');
    const write = require('../write');
    const exists = require('../exists');
    const log = require('../log');
    const source = join(appDir(), 'sass.js');
    const build = appBuildDir();
    const defaultStyle = join(appDir(), 'app/sass/style.scss');
    let configurations = {};

    // make this so that it read a JS file for SASS functions
    let functions = {};

    fs.readdirSync(join(__dirname, 'sassFunctions')).forEach((sassFunction) => {
      functions[sassFunction] = require(join(__dirname, 'sassFunctions', sassFunction));
    });

    if (exists(source)) {
      configurations = require(source);
    }
    // default SASS configuration
    else if (exists(defaultStyle)) {
      configurations = [
        {
          file: defaultStyle,
          outFile: join(build, 'css/style.css'),
          map: join(build, 'css/style.css.map'),
          build: 'external', // options: inline,  external
          outputStyle: 'expanded', // options: nested, expanded, compact, compressed
          sourceMap: true
        }
      ];
    }

    await _.each(configurations, async (configuration) => {
      if (!exists(configuration.file)) {
        return log(`${configuration.file} does not exists`, 'warn');
      }
      else {
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
        await write(defaultConfigurations.outFile, sassResult.css.toString());
        // write map    
        if (defaultConfigurations.sourceMap) {
          await write(defaultConfigurations.map, sassResult.map.toString());
        }
      }
    });
    
    resolve();

  });
};

module.exports = sass;
