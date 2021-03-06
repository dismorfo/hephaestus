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

      const { 
        join, 
        basename 
      } = require('path');

      const cheerio = require('cheerio')

      const _ = require('underscore');
      const helpers = require('../helpers');
      const templateToUse = require('../templateToUse');
      const read = require('../read');
      const appDir = require('../appDir');  
      const exists = require('../exists');
      const readdirSync = require('../readdirSync');
      const template = templateToUse(data.module);
      const task = data.task;
      
      let componentsKeys = null;
      
      if (data.components) {
        componentsKeys = Object.keys(data.components);
      }

      /** register Handlebars helpers */
      _.each(helpers(), (helper, key) => {
        Handlebars.registerHelper(key, helper);
      });

      const rawTemplate = read.text(template);

      /** compliled the template */
      const handlebarsTemplate = Handlebars.compile(rawTemplate);
      
      /** read partials inside app/partials */
      let appPartialsDir = join(appDir(), 'app/partials');

      /** read partials inside app/pages/${task} */
      const appTaskPartialsDir = join(appDir(), 'app/pages', task);
      
      if (exists(appPartialsDir)) {
        _.each(readdirSync(appPartialsDir), (filename) => {
          if (!filename.match('.hbs')) return;
          const name = basename(filename, '.hbs');
          let partial = null;
          // task overwrite app partial, use partial located inside {appRoot}/app/pages/{task}
          if (exists(join(appTaskPartialsDir, filename))) {
            partial = read.text(join(appTaskPartialsDir, filename));
          }
          // use app partial located inside {appRoot}/app/partials
          else {
            partial = read.text(join(appPartialsDir, filename));
          }
          /** register Handlebars partials */
          Handlebars.registerPartial(name, partial);        
        });
      }

      // i migth want to inject the JS here
      // const dom = new JSDOM(handlebarsTemplate(data));
      // // if (componentsKeys) {
      // //   for (const key of componentsKeys) {
      // //     const element = dom.window.document.querySelector(key);
      // //     if (element) {
      // //       element.outerHTML = data.components[key].html;
      // //     }
      // //   }
      // // }
      // return resolve(dom.serialize());

      const $ = cheerio.load(handlebarsTemplate(data))

      return resolve($.html());

    }
    catch (error) {
      reject(error);
    }
  });
};
