/**
 * hephaestus.js
 */
'use strict';

// http://underscorejs.org
const _ = require('underscore');
// https://nodejs.org/api/fs.html
const fs = require('fs');
// https://npmjs.org/package/rimraf
const rimraf = require('rimraf');
// https://nodejs.org/api/path.html
const { resolve } = require('path');
// https://github.com/felixge/node-dateformat
const dateformat = require('dateformat');
// track start time
const timespan = _.now();
// https://github.com/AvianFlu/ncp
let copy = require('ncp').ncp;
copy.limit = 16;
// https://www.npmjs.com/package/node-cleanup
const nodeCleanup = require('node-cleanup');
// https://www.npmjs.com/package/node-notifier
const notifier = require('node-notifier');
// https://www.npmjs.com/package/solr-node
const discovery = require('solr-node');

let modules = {};

fs.readdirSync(resolve(__dirname, 'lib')).forEach(library => {
  modules[library] = require(resolve(__dirname, 'lib', library));
});

module.exports = _.extendOwn({
  timespan: timespan,
  dateformat: dateformat,
  copy: copy,
  discovery: discovery,
  rimraf: rimraf,
  notifier: notifier,
  nodeCleanup: nodeCleanup
}, modules);
