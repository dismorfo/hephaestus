module.exports = exports = function helpers () {

  const path = require('path') 

  const _ = require('underscore')
    
  const appDir = require('../appDir')
  
  const exists = require('../exists')
  
  const readdirSync = require('../readdirSync')
  
  const helpersDir = path.join(appDir(), 'app/helpers')

  let helpers = {}
  
  helpers.json = function (context, options) {
    return options.fn(JSON.parse(context));
  }
  
  helpers.speakingurl = function (context, options) {
    var getSlug = require('speakingurl');
    return getSlug(this.label);
  }

  if (exists(helpersDir)) {
    _.each(readdirSync(helpersDir), (helper) => {
      const regex = RegExp('^Handlebars\.(.*)\.js$')
      const found = regex.exec(helper)
      if (found) {
        helpers[found[1]] = require(path.join(helpersDir, helper))
      }
    })
  }

  return helpers
  
}
