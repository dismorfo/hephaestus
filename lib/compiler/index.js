'use strict';

/**
 * Compile
 */
const { join, parse } = require('path');
const { _ } = require('underscore');
const { now } = require('underscore');
const appDir = require('../appDir');
const configurations = require('../configurations');
const exists = require('../exists');
const read = require('../read');
const appBuildDir = require('../appBuildDir');
const write = require('../write');
const appUrl = require('../appUrl');
const log = require('../log');
const { isUri } = require('../isUrl');
const timespan = now();

function transform (code = '') {
  const configurations = require('../configurations');
  return new Promise(resolve => {
    const { transform } = require('@babel/core');
    transform(code, configurations.babel(), (err, result) => {
      if (err) {
        log('Error transforming.', 'error');
      }
      else {
        resolve(result.code);
      }
    });
  });
}

async function asyncCall (code = []) {
  let entry = null;
  let out = '';
  for (entry of code) {
    out += await transform(entry);
  }
  return out;
}

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
function es5 (js, module) {
  return new Promise(async (resolve, reject) => {
    const parseModule = parse(module);
    const jsConfiguration = configurations.js();
    const template = jsConfiguration.template;
    const type = jsConfiguration.build;
    const currentModulePath = join(module, js);
    const sharedResourcesPath = join(appDir(), 'app/javascript', js);
    let src = '';
    let code = '';
    let outJSFileName = null;
    let pathParse = null;
    let closure = '';
    let outFilename = '';
    let rawSource = '';
    let compiledSource = '';
    // JavaScript files can be in 2 different folders or external Url
    // --------------------------------------------------------------
    // 1) Current page
    // 2) App shared resources
    // 3) External Url
    if (exists(currentModulePath) || exists(sharedResourcesPath)) {
      if (exists(currentModulePath)) {
        src = currentModulePath;
        pathParse = parse(src);
        outJSFileName = `${pathParse.name}-${parseModule.base}${pathParse.ext}`;
      }
      else {
        src = sharedResourcesPath;
        outJSFileName = js;
      }
      outFilename = join(appBuildDir(), 'js', outJSFileName);
      // Check if outFilename does not exists
      if (!exists(outFilename)) {
        // read rawSource
        rawSource = await read.text(src);
        // we need to compile rawSource
        compiledSource = await asyncCall([rawSource]);
        // write to outFilename
        await write(outFilename, compiledSource);
      }
      // test again for outFilename
      try {
        if (exists(outFilename)) {
          if (type === 'inline') {
            code = await read.text(outFilename);
          }
          else {
            code = appUrl() + '/' + join('js', outJSFileName);
          }
          closure = await _.template(template[type])({ src: code, now: timespan });
          resolve(closure);
        }
        else {
          throw new Error(`Unable to read ${outFilename}.`);
        }
      }
      catch (error) {
        reject(error);
      }
    }
    // 2) Check if we have an external URL
    else if (isUri(js)) {
      closure = await _.template(template['external'])({ src: js, now: timespan });
      resolve(closure);
    }
    // Javascript file does not exists
    else {
      reject(`Javascript file ${js} not found.`);
    }
  });
}

async function compiler (asset, module, type) {
  let closure = '';
  switch (type) {
  case 'es5':
    closure = await es5(asset, module);
    break;
  }
  return closure;
}

exports.compiler = compiler;
