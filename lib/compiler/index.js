'use strict';

/**
 * Compile
 */
const { parse } = require('path');
const _ = require('underscore');
const appDir = require('../appDir');
const configurations = require('../configurations');
const exists = require('../exists');
const read = require('../read');
const appBuildDir = require('../appBuildDir');
const write = require('../write');
const appUrl = require('../appUrl');
const log = require('../log');
const { isUri } = require('../isUrl');
const { transformSync } = require('@babel/core');
const timespan = _.now();

/** JS files */

/**
 * We allow to configure the app to use: compressed or expanded (default
 * to expanded for development purposes). 
 * 
 * The app can also be configure to host the JavaScript files "inline" 
 * or "external" (default to external for development purposes).
 *
 * In production enviorments we want to set the app to use the compressed
 * Javascript file and host it inline (in the HTML body of the page)
 *
 * In order to use Javascripts files, the file must be specify using the
 * assest object in index.js
 *
 * Javascripts files are listed as array in index.js as
 * part of the assest object.
 *
 * e.g.,
 *  "assets" : {
 *     "js" : [
 *       "commons.js",
 *       "crossframe.js",
 *       "books.js"
 *     ]
 *   }
 * 
 */
async function es5 (js, module) {
  const parseModule = parse(module);
  const jsConfiguration = configurations.js();
  const template = jsConfiguration.template;
  const type = jsConfiguration.build;
  const currentModulePath = `${module}/${js}`;
  const sharedResourcesPath = `${appDir()}/app/javascript/${js}`;
  let outJSFileName = null;
  let pathParse = null;
  let src = '';
  let code = '';
  let compiledSource = '';

  // JavaScript files can be in 2 different folders or external Url

  // 1) Current page
  if (exists(currentModulePath)) {
    src = currentModulePath;
    pathParse = parse(src);
    outJSFileName = `${pathParse.name}-${parseModule.base}${pathParse.ext}`;
  }
  // 2) App shared resources
  else if (exists(sharedResourcesPath)) {
    src = sharedResourcesPath;
    outJSFileName = js;
  }
  // 2) Check if we have an external URL
  else if (isUri(js)) {
    const closure = _.template(template.external)({ src: js, now: timespan });
    return closure;
  }
  // Javascript file does not exists
  else {
    console.log(`Javascript file ${js} not found.`)
    process.exit(1);
  }

  const outFilename = `${appBuildDir()}/js/${outJSFileName}`;

  // Check if outFilename does not exists
  if (!exists(outFilename)) {
    // we need to compile rawSource
    const transformSource = transformSync(read.text(src), configurations.babel());
    compiledSource = transformSource.code;
    log(`Transform ${src}`, 'babel');
    // write to outFilename
    write(outFilename, compiledSource);
  }

  // test again for outFilename
  try {
    if (exists(outFilename)) {
      if (type === 'inline') {
        code = read.text(outFilename);
      }
      else {
        code = `${appUrl()}/js/${outJSFileName}`;
      }
      const closure = await _.template(template[type])({ src: code, now: timespan });
      return closure;
    }
    else {
      throw new Error(`Unable to read ${outFilename}.`);
    }
  }
  catch (error) {
    console.log(error)
    process.exit(1);
  }

}

async function compiler(asset, module, type) {
  switch (type) {
    case 'es5':
      const closure = await es5(asset, module);
      return closure;
    }
}

exports.compiler = compiler;
