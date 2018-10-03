/**
 * agartha.js
 * https://github.com/NYULibraries/agartha.js
 *
 * Copyright (c) 2014 New York University, contributors
 * Licensed under the MIT license.
 */

'use strict';

const agartha = () => {
  // http://underscorejs.org
  const _ = require('underscore');
  if (!_.isObject(process.agartha)) {
    // https://nodejs.org/api/fs.html
    const fs = require('fs');
    // https://npmjs.org/package/rimraf
    const rimraf = require('rimraf');
    // https://nodejs.org/api/path.html
    const path = require('path');
    // https://nodejs.org/api/events.html
    const events = require('events');
    // Create an eventEmitter object
    const eventEmitter = new events.EventEmitter();
    // https://github.com/request/request
    const request = require('request');
    // https://github.com/felixge/node-dateformat
    const dateformat = require('dateformat');
    // track start time
    const timespan = _.now();
    // https://github.com/substack/node-mkdirp
    const mkdirp = require('mkdirp');
    // https://github.com/adam-lynch/graceful-ncp
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
    })

    process.agartha = {
      _: _,
      path: path,
      timespan: timespan,
      request: request,
      on: eventEmitter.addListener,
      emit: eventEmitter.emit,
      dateformat: dateformat,
      copy: copy,
      discovery: discovery,
      nodeCleanup : nodeCleanup,
      fs: fs,
      rimraf: rimraf,
      notifier: notifier,
      _onInit: [],
      _onDone: [],
      _onForge: [],
      _filemap: {}
    };

    _.extendOwn(process.agartha, modules);

    nodeCleanup((exitCode, signal) => {
      process.agartha._.forEach(process.agartha._onDone, (callback) => {
        process.agartha.log('Callback triggered by ' + callback.command + ' onDone', 'signal');
        if (process.agartha._.isFunction(callback.action)) {
          callback.action();
        }
      })
    })

  }

  return process.agartha;

}

exports.agartha = agartha();
