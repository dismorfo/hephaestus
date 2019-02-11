'use strict';

/**
 * HTML
 */
async function html (data = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const task = data.task;
      const { join } = require('path');
      const { minify } = require('html-minifier');  
      const { compiler } = require('../compiler');
      const _ = require('underscore');
      const css = require('../css');
      const get = require('../get');
      const write = require('../write');
      const log = require('../log');
      const render = require('../render');
      const appBuildDir = require('../appBuildDir');
      const configurations = require('../configurations');
      const spaghetti = require('../spaghetti');
      const debugLog = (get('DEBUG_LOG') === 'true') ? true : false;
      let rendered = '';
      let html = '';

      const scriptType = 'es5'; // default to es5 (think more about this)
      
      /** read project configuration object */
      let source = get();

      /** string that holds JavaScript and handlebars templates */
      data.closure = '';

      /** copy all of the page properties in the source */
      _.extend(data, source);

      if (!_.isObject(data.assets)) {
        data.assets = { 'js' : [], 'hbs' : [], 'ts' : [] };
      }

      // Assest: TypeScript, JavaScript and templates
      if (_.isObject(data.assets)) {
        if (_.isArray(data.assets.ts)) {
          for (let entry of data.assets.ts) {
            log(`Soon TypeScript will be implemented. Come back soon.`, 'ok');
          }
        }
        if (_.isArray(data.assets.js)) {          
          for (let entry of data.assets.js) {
            data.closure += await compiler(entry, data.module.current, scriptType);
          }
        }
        if (_.isArray(data.assets.hbs)) {
          for (let entry of data.assets.hbs) {
            log(`Soon HBS will be implemented. Come back soon.`, 'ok');
          }
        }
      }

      /** CSS / SASS */
      data.css = css();

      /** map widgets to the task and load data Object if type is not local */
      data.content = await spaghetti(data);

      // render data
      rendered = await render(data);
      
      // minify HTML 
      html = await minify(rendered, configurations.minify());

      // write HTML file
      await write(join(appBuildDir(), data.route), html);    

      if (debugLog) {
        await write(join(appBuildDir(), task + '.json'), JSON.stringify(data, null, 4));
      }
      resolve(`Transformed ${data.route}`);
    }
    catch (error) {
      reject(error);
    }
  });
}

exports.html = html;
