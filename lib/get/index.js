/**
 * get
 */
module.exports = exports = function get (option) {
  const _ = require('underscore')
  const path = require('path')
  const exists = require('../exists')
  const exit = require('../exit')
  const read = require('../read')
  const jsonSource = path.join(process.cwd(), 'project.json')
  const jsonEnvironment = path.join(process.cwd(), 'env.json')
  if (exists(jsonSource)) {
    let project = read.json(jsonSource)
    if (exists(jsonEnvironment)) {
      const environment = read.json(jsonEnvironment)
      const AGARTHA_ENVIRONMENT = process.env.AGARTHA_ENVIRONMENT ? process.env.AGARTHA_ENVIRONMENT : 'default'
      try {
        // check for operational errors
        // https://www.joyent.com/node-js/production/design/errors#operational-errors-vs-programmer-errors
        const datasource = environment[AGARTHA_ENVIRONMENT]
        if (_.isUndefined(datasource)) {
          throw new Error('Unable to read datasource')
        }
        project.datasource = datasource
      }
      catch (e) {
        exit(e)
      }
      if (_.isUndefined(option)) {
        return project
      }
      else {
        if (_.has(project, option)) {
          return project[option]
        }
      }
    }
    else {
      throw new Error('Unable to read env.json')
    }
  }
  else {

  }
  return false
}