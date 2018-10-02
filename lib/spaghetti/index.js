module.exports = exports = function spaghetti (module, source) {
  const _ = require('underscore')
  const path = require('path')  
  const read = require('../read')
  const log = require('../log')
  const exists = require('../exists')
  const appDir = require('../appDir')
  let sourceContent = (source.content) ? source.content : {}

  const iterate = (obj) => {
    let htmlString = ''
    let extname = null
    let localSource = null
    for (let property in obj) {
      if (obj.hasOwnProperty(property)) {
        if (typeof obj[property] === 'object') iterate(obj[property])
        // if property vale it's localsource; set html property and load the source
        else if (property === 'localsource') {
          // local source can be in 2 places
          // page directory (pages/{page}) or shared directory (app/localsource)
          localSource = path.join(module.current, obj[property])
          // 1 
          // console.log('1 ' + localSource)
          if (!exists(localSource)) {
            localSource = path.join(appDir(), 'app/localsource', obj[property])
            // console.log('2 ' + localSource)
          }

          if (!exists(localSource)) {
            console.log('Spaghetti: !exists(localSource) -> error -> ' + localSource)
            //console.log(obj[property])
            // console.log(property)
          } // error; do something
          extname = path.extname(localSource)
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
          log(htmlString, 'warning')
          obj.html = htmlString
        }
      }
    }
  }

  if (source.task == 'search') {
    console.log(sourceContent)
  }
  
  iterate(sourceContent)

  _.each(sourceContent, (content, a) => {
    _.each(sourceContent[a], (pane, b) => {
      if (!_.isUndefined(sourceContent[a][b].widgets)) {
        if (_.isArray(sourceContent[a][b].widgets)) {
          sourceContent[a][b].raw = []
          _.each (sourceContent[a][b].widgets, (widget, c) => {
            var spaghetti = {}
            var sourceType = widgets[sourceContent[a][b].widgets[c]].sourceType;
            if (sourceType === 'json') {
              spaghetti = {
                label : widget,
                widget : widgets[sourceContent[a][b].widgets[c]],
                data : agartha.read.json(agartha.path.join(agartha.cwd(), widgets[sourceContent[a][b].widgets[c]].source))
              }
            }
            /** if you care about placement in specific scenario */
            sourceContent[a][b][widget] = spaghetti
            /** as array to loop by weight */
            sourceContent[a][b].raw.push(spaghetti)
          })
        }
      }
    })
  })

  return sourceContent

}
