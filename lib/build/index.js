/**
 * build
 */
module.exports = exports = function build () {
  const { agartha } = require('../../index')
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
  const page_path = path.join(cwd(), 'app/relics', get('relic'), 'pages')
  const pages_directory = path.join(appDir(), 'app/pages')
  let sources = getDirectories(pages_directory)
  let pages = {}
  let module_directory
  let site_module_directory

  // agartha.on('task.done', html)
  
  // find all the file from the original module
  for (let i = 0; i < sources.length; i++) {
    module_directory = path.join(page_path, sources[i])
    site_module_directory = path.join(pages_directory, sources[i])
    if (exists(module_directory)) {
      pages[sources[i]] = {
        files : walk(module_directory),
        original_files : walk(module_directory),
        module : {
          base: module_directory,
          current: site_module_directory
        }
      }
    }
    if (_.isObject(pages[sources[i]])) {
      _.extend(pages[sources[i]].files, walk(site_module_directory))
    }
    else {
      pages[sources[i]] = {
        files: walk(site_module_directory),
        original_files: walk(site_module_directory),
        module: {
          base: site_module_directory,
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
        files: element.files,
        original_files: element.original_files,
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