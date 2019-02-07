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
const path = require('path');
// https://github.com/request/request
const request = require('request');
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
// https://www.npmjs.com/package/solr-client
const discovery = require('solr-client');

let modules = {};
    
fs.readdirSync(path.join(__dirname, 'lib')).forEach((module) => {
  modules[module] = require(path.join(__dirname, 'lib', module));
});

let agartha = {
  _: _,
  fs: fs,
  path: path,
  timespan: timespan,
  request: request,
  dateformat: dateformat,
  copy: copy,
  discovery: discovery,
  rimraf: rimraf,
  notifier: notifier,
  nodeCleanup: nodeCleanup
};

module.exports = _.extendOwn(agartha, modules);
