/**
 * hephaestus.js
 */

 // http://underscorejs.org
const _ = require('underscore');

// https://nodejs.org/api/fs.html
const {
  readdirSync
} = require('fs');

// https://nodejs.org/api/path.html
const {
  resolve 
} = require('path');

let modules = {};

readdirSync(resolve(__dirname, 'lib')).forEach(library => {
  modules[library] = require(resolve(__dirname, 'lib', library));
});

module.exports = _.extendOwn({
  timespan: _.now(),
  dateformat: require('dateformat'), // https://github.com/felixge/node-dateformat
  copy: require('ncp').ncp, // https://github.com/AvianFlu/ncps
  discovery: require('solr-node'), // https://www.npmjs.com/package/solr-node
  rimraf: require('rimraf'), // https://npmjs.org/package/rimraf
  notifier: require('node-notifier'), // https://www.npmjs.com/package/node-notifier
  nodeCleanup: require('node-cleanup'), // https://www.npmjs.com/package/node-cleanup
}, modules);

