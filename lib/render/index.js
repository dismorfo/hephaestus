'use strict';

module.exports = async function render (data) {
  return new Promise((resolve, reject) => {
    // Assests can be in 2 different directories
    // -----------------------------------------
    // 1) Current module
    // 2) Shared resources
    // 3) Fail
    const Handlebars = require('handlebars');
    const path = require('path');
    const _ = require('underscore');
    const helpers = require('../helpers');
    const templateToUse = require('../templateToUse');
    const read = require('../read');
    const appDir = require('../appDir');  
    const exists = require('../exists');
    const readdirSync = require('../readdirSync');
    const template = templateToUse(data.module);
    const task = data.task;
    /** register Handlebars helpers */
    _.each(helpers(), (helper, key) => {
      Handlebars.registerHelper(key, helper);
    });
    /** compliled the template */
    const handlebarsTemplate = Handlebars.compile(read.text(template));
    /** read partials inside app/partials */
    let appPartialsDir = path.join(appDir(), 'app/partials');
    /** read partials inside app/pages/${task} */
    let appTaskPartialsDir = path.join(appDir(), 'app/pages', task);
    if (exists(appPartialsDir)) {
      _.each(readdirSync(appPartialsDir), (filename) => {
        if (!filename.match('.hbs')) return;
        const name = path.basename(filename, '.hbs');
        let partial = null;
        // we found a unregistered partial inside {appRoot}/app/partials
        // figure out if this task overwrites it
        appTaskPartialsDir = path.join(appTaskPartialsDir, filename);
        // task overwrite app partial, use partial located inside {appRoot}/app/pages/{task}
        if (exists(appTaskPartialsDir)) {
          partial = read.text(appTaskPartialsDir);
        }
        // use app partial located inside {appRoot}/app/partials
        else {
          partial = read.text(path.join(appPartialsDir, filename));
        }
        /** register Handlebars partials */
        Handlebars.registerPartial(name, partial);        
      });
    }
    return resolve(handlebarsTemplate(data));
  });
};
