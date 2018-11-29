/**
 * build
 */
module.exports = exports = function build () {
  const path = require('path')
  const _ = require('underscore')
  const log = require('../log')
  const isClass = require('../isClass')
  const cwd = require('../cwd')
  const get = require('../get')
  const walk = require('../walk')
  const read = require('../read')
  const exists = require('../exists')
  const appDir = require('../appDir')
  const html = require('../html')
  const getDirectories = require('../getDirectories')
  const pages_directory = path.join(appDir(), 'app/pages')
  let sources = getDirectories(pages_directory)
  let pages = {}
  let site_module_directory

  // find all the file from the original module
  for (let i = 0; i < sources.length; i++) {
    site_module_directory = path.join(pages_directory, sources[i])
    if (!_.isObject(pages[sources[i]])) {
      pages[sources[i]] = {
        files: walk(site_module_directory),
        module: {
          current: site_module_directory
        }
      }
    }
  }

  try {
    let length = Object.keys(pages).length
    const keys = _.keys(pages)    
    while (length--) {
      const element = pages[keys[length]]
      const data = {
        task: keys[length],
        template: element.files['index.mustache'],
        module: element.module
      }
      let datasorce = (!_.isUndefined(element.files['index.js'])) ? require(element.files['index.js']) : undefined
      if (datasorce) {
        if (_.isFunction(datasorce)) {
          // we don't want to do this
          // https://stackoverflow.com/questions/30758961/how-to-check-if-a-variable-is-an-es6-class-declaration
          if (isClass(datasorce)) {
            new datasorce(data)
          }
          else {
            datasorce(data)
          }
        }
        else {
          html(_.extend(datasorce, data))
        }
      }
    }
  }
  catch (error) {
    console.log(error)
  }
}