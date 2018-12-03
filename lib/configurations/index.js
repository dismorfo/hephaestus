/**
 * configurations
 */

function htmlminify () {
  const exists = require('../exists');
  const path = require('path');
  const appDir = require('../appDir');
  const read = require('../read');
  const source = path.join(appDir(), 'htmlminify.json');
  let configurations = {};
  if (exists(source)) {
    configurations = read.json(source);
  }
  return configurations;
}

function js () {
  const exists = require('../exists');
  const path = require('path');
  const appDir = require('../appDir');
  const read = require('../read');
  const source = path.join(appDir(), 'js.json');
  var configurations = {};
  if (exists(source)) {
    configurations = read.json(source);
  }
  else { // default JS configuration
    configurations = {
      build: 'external', // options: inline,  external
      style: 'compressed', // options: compressed, expanded
      uglifyJSOptions: { // https://github.com/mishoo/UglifyJS2
        sourceMap: false
      }
    };
  }
  configurations.template = {
    inline   : '<script data-timespan="<%= now %>"><%= src %></script>',
    external : '<script src="<%= src %>?n<%= now %>" defer></script>'
  };
  
  return configurations;
}

module.exports = {
  htmlminify: htmlminify, 
  js: js
};  
