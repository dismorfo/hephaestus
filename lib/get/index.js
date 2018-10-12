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
  else return false 
  
  /**
   * If not option, assume the client wants data Object
   */
  if (_.isUndefined(option)) {
    return project
  }
  /**
   * Return the option
   */
  else {
    /**
     * Priorities enviromental variables
     */   
    if (_.has(process.env, option)) {
      return process.env[option]
    }
    else {
      if (_.has(project, option)) {
        return project[option]
      }
    }
    return false
  }
}