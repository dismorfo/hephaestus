/**
 * get
 */
module.exports = exports = function get (option) {
  const _ = require('underscore')
  const path = require('path')
  const exists = require('../exists')
  const exit = require('../exit')
  const read = require('../read')
  const jsSource = path.join(process.cwd(), 'hephaestus.js')
  let project = null
  if (exists(jsSource)) {
    data = require(jsSource)
    project = _.isFunction(data) ? data() : data
  }
  else if (exists(jsonSource)) {
    project = read.json(jsonSource)
  }
  else return false 
  
  if (_.isUndefined(option)) {
    return project
  }
  else {
    if (_.has(project, option)) {
      return project[option]
    }
    else {
      if (_.has(process.env, option)) {
        return process.env[option]
      }
    }
    return false
  }
}