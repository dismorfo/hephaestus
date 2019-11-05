'use strict';

module.exports = async function render (data) {
  return new Promise((resolve, reject) => {
    try {
      // Assests can be in 2 different directories
      // -----------------------------------------
      // 1) Current module
      // 2) Shared resources
      // 3) Fail
      const Handlebars = require('handlebars');
      const { join, basename } = require('path');
      const _ = require('underscore');
      const helpers = require('../helpers');
      const templateToUse = require('../templateToUse');
      const read = require('../read');
      const appDir = require('../appDir');  
      const exists = require('../exists');
      const readdirSync = require('../readdirSync');
      const template = templateToUse(data.module);
      const task = data.task;
      const { JSDOM } = require('jsdom');

      const componentsKeys = Object.keys(data.components);

      // console.log(componentsKeys);

      /** register Handlebars helpers */
      _.each(helpers(), (helper, key) => {
        Handlebars.registerHelper(key, helper);
      });

      const rawTemplate = read.text(template);

      // console.log(rawTemplate);

      /** compliled the template */
      const handlebarsTemplate = Handlebars.compile(rawTemplate);
      /** read partials inside app/partials */
      let appPartialsDir = join(appDir(), 'app/partials');
      /** read partials inside app/pages/${task} */
      let appTaskPartialsDir = join(appDir(), 'app/pages', task);
      if (exists(appPartialsDir)) {
        _.each(readdirSync(appPartialsDir), (filename) => {
          if (!filename.match('.hbs')) return;
          const name = basename(filename, '.hbs');
          let partial = null;
          // we found a unregistered partial inside {appRoot}/app/partials
          // figure out if this task overwrites it
          appTaskPartialsDir = join(appTaskPartialsDir, filename);
          // task overwrite app partial, use partial located inside {appRoot}/app/pages/{task}
          if (exists(appTaskPartialsDir)) {
            partial = read.text(appTaskPartialsDir);
          }
          // use app partial located inside {appRoot}/app/partials
          else {
            partial = read.text(join(appPartialsDir, filename));
          }
          /** register Handlebars partials */
          Handlebars.registerPartial(name, partial);        
        });
      }

      const dom = new JSDOM(handlebarsTemplate(data));
      
      for (const key of componentsKeys) {
        dom.window.document.querySelector(key).outerHTML = data.components[key].html;
      }

      return resolve(dom.serialize());
    }
    catch (error) {
      reject(error);
    }
  });
};
