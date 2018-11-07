/**
 * configurations
 */

 function htmlminify () {
  const exists = require('../exists')
  const path = require('path')
  const appDir = require('../appDir')
  const read = require('../read')
  const source = path.join(appDir(), 'htmlminify.json')
  let configurations = {}
  if (exists(source)) {
    configurations = read.json(source)
  }
  return configurations
 }

 function js () {
  const exists = require('../exists')
  const path = require('path')
  const appDir = require('../appDir')
  const read = require('../read')
  const source = path.join(appDir(), 'js.json')
  var configurations = {}
  if (exists(source)) {
    configurations = read.json(source)
  }
  else { // default JS configuration
    configurations = {
      build : 'external', // options: inline,  external
      style : 'expanded' // options: compressed, expanded
    }
  }
  configurations.template = {
    inline   : '<script data-timespan="<%= now %>"><%= src %></script>',
    external : '<script src="<%= src %>?n<%= now %>" defer></script>'
  }
  return configurations
}

function uglify () {
  return {
    options: {
      banner: '/*! <%= pkg.name %> */\n',
      compress: {}, // https://github.com/gruntjs/grunt-contrib-uglify/issues/298#issuecomment-74161370
      preserveComments: false
    },
    my_target: {
      files: () => {
        var targets = {}
        return targets
      }
    }
  }
}

function configurations () {
  return {
    htmlminify: htmlminify, 
    js: js,
    uglify: uglify
  }  
}

module.exports = exports = configurations()
