/**
 * get
 */
module.exports = exports = function get (option) {
  const AGARTHA_ENVIRONMENT = process.env.AGARTHA_ENVIRONMENT ? process.env.AGARTHA_ENVIRONMENT : 'default'
  const _ = require('underscore')
  const path = require('path')
  const exists = require('../exists')
  const exit = require('../exit')
  const read = require('../read')
  const jsonSource = path.join(process.cwd(), 'project.json')
  const jsSource = path.join(process.cwd(), 'project.js')
  const jsonEnvironment = path.join(process.cwd(), 'env.json')
  let project = null

  let environment = (exists(jsonEnvironment)) ? read.json(jsonEnvironment) : {}

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