/**
 * build
 */
async function build () {
  const { join } = require('path');
  const { html } = require('../html');
  const _ = require('underscore');
  const log = require('../log');
  const isClass = require('../isClass');
  const walk = require('../walk');
  const appDir = require('../appDir');  
  const getDirectories = require('../getDirectories');
  const pages_directory = join(appDir(), 'app/pages');
  let sources = getDirectories(pages_directory);
  let pages = {};
  let site_module_directory;
  // find all the file from the original module
  for (let i = 0; i < sources.length; i++) {
    site_module_directory = join(pages_directory, sources[i]);
    if (!_.isObject(pages[sources[i]])) {
      pages[sources[i]] = {
        files: walk(site_module_directory),
        module: {
          current: site_module_directory
        }
      };
    }
  }
  try {
    let length = Object.keys(pages).length;
    const keys = _.keys(pages);
    let op = '';
    while (length--) {
      const element = pages[keys[length]];
      const data = {
        task: keys[length],
        template: element.files['index.mustache'],
        module: element.module
      };
      let datasorce = (!_.isUndefined(element.files['index.js'])) ? require(element.files['index.js']) : undefined;
      if (datasorce) {
        if (_.isFunction(datasorce)) {
          if (isClass(datasorce)) {
            op = await new datasorce(data);
          }
          else {
            op = await datasorce(data);
          }
        }
        else {
          op = await html(_.extend(datasorce, data));
          log(op, 'build');
        }
      }
    }
  }
  catch (error) {
    console.log(error);
  }
}

exports.build = build;
