/**
 * configurations
 */

const path = require('path');
const appDir = require('../appDir');
const exists = require('../exists');
const read = require('../read');

function babel () {
  let configuration = {};
  let configurationPath = path.join(appDir(), '.babelrc.js');
  // if exist, read .babelrc
  // See also: https://blogs.msdn.microsoft.com/typescript/2018/08/27/typescript-and-babel-7/
  if (exists(configurationPath)) {
    configuration = require(configurationPath);
    configuration.babelrc = false;
    configuration.configFile = false;
  }
  else {
    configuration = {
      presets: [
        'minify', // https://babeljs.io/docs/en/babel-preset-minify
        [
          '@babel/preset-env', // https://babeljs.io/docs/en/next/babel-preset-env.html
          {
            'useBuiltIns': 'entry'
          }
        ]
      ],
      babelrc: false,
      configFile: false
    };
  }
  return configuration;
}

// See: https://www.npmjs.com/package/html-minifier
function minify () {
  const source = path.join(appDir(), 'htmlminify.json');
  let configurations = {
    removeScriptTypeAttributes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    quoteCharacter: '"'
  };
  if (exists(source)) {
    configurations = read.json(source);
  }
  return configurations;
}

function js () {
  const source = path.join(appDir(), 'js.json');
  let configurations = {};
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
  minify: minify, 
  js: js,
  babel: babel
};  
