module.exports = function spaghetti (source) {  

  const _ = require('underscore');
  const path = require('path');
  const read = require('../read');
  const log = require('../log');
  const exists = require('../exists');
  const appDir = require('../appDir');

  let map = {};
  
  map[source.current] = {
    sourceContent: (source.content) ? source.content : {}
  };

  const iterate = (obj) => {
    let htmlString = '';
    let extname = null;
    let localSource = null;
    for (let property in obj) {
      if (!_.isUndefined(property)) {
        if (obj.hasOwnProperty(property)) {
          // console.log(`Fuck why obj`)
          // console.log(obj)
          // console.log(`Fuck why obj[property] = ${obj[property]}`)
          if (typeof obj[property] === 'object') {
            iterate(obj[property]);
          }
          // if property vale it's localsource; set html property and load the source
          else if (!_.isUndefined(property) && property == 'localsource') {
            // local source can be in 2 places
            // page directory (pages/{page}) or shared directory (app/localsource)
            localSource = path.join(source.module.current, obj[property]);
            if (!exists(localSource)) {
              localSource = path.join(appDir(), 'app/localsource', obj[property]);
            }
            if (!exists(localSource)) {
              return;
            }
            extname = path.extname(localSource);          
            switch (extname) {
              case '.html' :
                // check if the value contain a valid file extention
                htmlString = read.text(localSource)
                if (_.isEmpty(htmlString)) {
                  htmlString = 'Unable to read ' + localSource
                  log(htmlString, 'warning')
                }
                obj.html = htmlString
                break
              case '.json' :
                obj.localsource = read.json(localSource)              
                break
            }
          }
          // not implemented but will be good to accpet an URL and
          // load data (request) as PJAX. Work on this
          else if (property === 'pjax') {
            htmlString = 'Using PJAX as datasource is not implemented at the moment'
            log(htmlString, 'warning');
            obj.html = htmlString;
          }
        }
      }
    }
  }
  
  iterate(map[source.current].sourceContent);

  _.each(map[source.current].sourceContent, (content, a) => {
    _.each(map[source.current].sourceContent[a], (pane, b) => {
      if (!_.isUndefined(map[source.current].sourceContent[a][b].widgets)) {
        if (_.isArray(map[source.current].sourceContent[a][b].widgets)) {
          map[source.current].sourceContent[a][b].raw = []
          _.each (map[source.current].sourceContent[a][b].widgets, (widget, c) => {
            var spaghetti = {}
            var sourceType = widgets[map[source.current].sourceContent.widgets[c]].sourceType;
            if (sourceType === 'json') {
              spaghetti = {
                label : widget,
                widget : widgets[map[source.current].sourceContent[a][b].widgets[c]],
                data : agartha.read.json(agartha.path.join(agartha.cwd(), widgets[map[source.current].sourceContent[a][b].widgets[c]].source))
              }
            }
            /** if you care about placement in specific scenario */
            map[source.current].sourceContent[a][b][widget] = spaghetti
            /** as array to loop by weight */
            map[source.current].sourceContent[a][b].raw.push(spaghetti)
          })
        }
      }
    })
  });

  return map[source.current].sourceContent;

}
