module.exports = async function spaghetti (source) {
  const _ = require('underscore');
  const mm = require('marky-mark');
  const path = require('path');
  const read = require('../read');
  const log = require('../log');
  const exists = require('../exists');
  const request = require('../request');
  const appDir = require('../appDir');
  let map = {};
  let md = null;
  
  map[source.current] = {
    sourceContent: (source.content) ? source.content : {}
  };

  const iterate = async obj => {
    let htmlString = '';
    let extname = null;
    let localSource = null;
    for (let property in obj) {
      if (!_.isUndefined(property)) {
        if (obj.hasOwnProperty(property)) {
          if (typeof obj[property] === 'object') {
            await iterate(obj[property]);
          }
          // if property vale it's localsource; set html property and load the source
          else if (!_.isUndefined(property) && property == 'localsource') {
            // local source can be in 2 places
            // 1) page directory (pages/{page}) 
            localSource = path.join(source.module.current, obj[property]);
            if (!exists(localSource)) {
              localSource = path.join(appDir(), 'app/localsource', obj[property]);
              // 2) shared directory (app/localsource)
              if (!exists(localSource)) {
                return;
              }              
            }
            extname = path.extname(localSource);          
            switch (extname) {
            case '.html':
              // check if the value contain a valid file extention
              htmlString = await read.text(localSource);
              if (_.isEmpty(htmlString)) {
                log(`Unable to read ${localSource}`, 'warning');
              }
              const Handlebars = require('handlebars');
              const helpers = require('../helpers')();
              /** register Handlebars helpers */
              for (helper of Object.keys(helpers)) {
                Handlebars.registerHelper(helper, helpers[helper]);
              } 
              /** compliled the template */
              const handlebarsTemplate = Handlebars.compile(htmlString);
              obj.html = handlebarsTemplate(source);
              break;
            case '.json':
              obj.localsource = read.json(localSource);          
              break;
            case '.md':
            case '.markdown':
              md = await mm.parseFileSync(localSource);
              obj.html = md.content;
              obj.meta = md.meta;
              break;                
            }
          }
          // not implemented but will be good to accpet an URL and
          // load data (request) as PJAX. Work on this
          else if (property === 'pjax') {
            htmlString = 'Using PJAX as datasource is not implemented at the moment';
            log(htmlString, 'warning');
            obj.html = htmlString;
          }
          else if (property === 'api') {
            obj.data = await request({
              uri: obj.api,
              json: true
            });
          }
        }
      }
    }
  };
  
  await iterate(map[source.current].sourceContent);

  return map[source.current].sourceContent;

};
