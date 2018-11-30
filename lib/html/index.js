'use strict'

// https://www.npmjs.com/package/marky-mark

/**
 * agartha
 * https://github.com/NYULibraries/agartha
 *
 * Copyright (c) 2014 New York University, contributors
 * Licensed under the MIT license.
 */
module.exports = exports = function html (data) {

  const { agartha } = require('hephaestus')
  const task = data.task
  const Handlebars = require('handlebars')
  const path = require('path')
  const _ = require('underscore')  
  const css = require('../css')
  const { minify } = require('html-minifier')  
  const UglifyJS = require('uglify-js')
  const helpers = require('../helpers')
  const templateToUse = require('../templateToUse')
  const get = require('../get')
  const appUrl = require('../appUrl')
  const read = require('../read')
  const write = require('../write')
  const log = require('../log')
  const appDir = require('../appDir')
  const exists = require('../exists')
  const relic = require('../relic')
  const appBuildDir = require('../appBuildDir')
  const readdirSync = require('../readdirSync')
  const cwd = require('../cwd')
  const configurations = require('../configurations')
  const spaghetti = require('../spaghetti')

  let assets = null;
  let partials = {};
  let pages = [];
  let widgets = [];
  let javascriptString = '';

  /** read project configuration object */
  let source = get();

  /** string that holds JavaScript and handlebars templates */
  data.closure = '';

  let compile = {
    hbs : (hbs) => {
      let template = _.template('<script id="<%= id %>" type="text/x-handlebars-template"><%= body %></script>')
      return template({
        id: hbs.id,
        body: read.text(hbs.source)
      })
    }
  }

  /** register Handlebars helpers */
  _.each(helpers(), (helper, key) => {
    Handlebars.registerHelper(key, helper)
  });

  try {

    // Assests can be in 4 different directories
    // ------------------------------------------------
    // 1) Current module
    // 2) Base module
    // 3) Current site shared resources
    // 4) Agartha shared resources
    // 5) Fail

    let route = data.route;

    data.template = templateToUse(data.module);

    let htmlminifyConfiguration = configurations.htmlminify();

    let uncompileTemplate = read.text(data.template);

    let handlebars_template = Handlebars.compile(uncompileTemplate);

    /** information about how to render the JS files in this project */
    let jsConfiguration = configurations.js();

    /** copy all of the page properties in the source */
    _.extend(data, source);

    // just in case we don't have assets and a widget wants to use it
    // @TODO: Figure out what I meant by this?
    if (!_.isObject(data.assets)) data.assets = { 'js' : [], 'hbs' : [] }

    /** load/read JSON configure file for each page in project */
    let appPages = path.join(appDir(), 'app/pages')

    // figure this out...
    // TODO: NEED TO FIX THE MENU
    readdirSync(appPages).forEach((page) => {
      let filepath = path.join(appPages, page, 'index.json')
      if (exists(filepath)) {
        pages.push(read.json(filepath))
      }
    })

    /** read partials */

    const app_partials_dir = path.join(appDir(), 'app/partials')
    const app_task_partials_dir = path.join(appDir(), 'app/pages', task)
    if (exists(app_partials_dir)) {
      _.each(readdirSync(app_partials_dir), (filename) => {
        if (!filename.match('.hbs')) return
        let name = path.basename(filename, '.hbs')
        let partial = null
        // we found a unregistered partial inside {appRoot}/app/partials
        // figure out if this task overwrites it
        const app_task_partials_dir_partial = path.join(app_task_partials_dir, filename)
        // task overwrite app partial, use partial located inside {appRoot}/app/pages/{task}
        if (exists(app_task_partials_dir_partial)) {
          partial = read.text(app_task_partials_dir_partial)
        }
        // use app partial located inside {appRoot}/app/partials
        else {
          partial = read.text(path.join(app_partials_dir, filename))
        }
        /** register Handlebars partials */
        Handlebars.registerPartial(name, partial)        
      })
    }
    // deal with assest: JavaScript, hbs templates and local CSS
    if (_.isObject(data.assets)) {
      /** JS files */
      /**
       * We allow to configure the app to use: compressed or expanded (default
       * to expanded for development purposes). The app can also be configure to
       * host the JavaScript files "inline" or "external" (default to expanded
       * for development purposes).
       *
       * In production enviorments we want to set the app to use the compressed
       * Javascript file and host it inline (in the HTML body of the page)
       *
       * in order to use Javascripts files, the file must be specify using the
       * assest object in index.json
       *
       */
      if (_.isArray(data.assets.js)) {
        /**
         *
         * Javascripts files are now listed as array in index.json as
         * part of the assest object.
         *
         * e.g.,
         *  "assets" : {
         *     "js" : [
         *       "commons.js",
         *       "crossframe.js",
         *       "books.js"
         *     ]
         *   }
         *
         * Widgets can also invoke JavaScript files if they include data-script attribute
         *
         */        
        _.each(data.assets.js, (js) => {
          // if compressed, map output
          let map = null
          let compiled = null
          let cdn = false
          // check if this it's a shared resource
          let shared = false
          // hold the path to the JavaScript file that will be use
          let src = ''
          let code = ''
          let UglifyJSResults = ''
          let type = jsConfiguration.build
          let style = jsConfiguration.style
          let template = jsConfiguration.template
          
          // JS file basename
          let basename = path.basename(js)
          // if compressed, map filename
          let outSourceMap = basename + '.map'
          let UglifyJSOptions = { 
            fromString: true, 
            outSourceMap: outSourceMap
          }

          // JavaScript files can be in 4 different folders
          // ------------------------------------------------
          // 1) Current module
          // 2) Base module
          // 3) Main app shared resources
          // 4) Agartha shared resources
          // 5) Fail
          // current module overwrite base module
          // 1) Current module
          if (exists(path.join(data.module.current, js))) {
            src = path.join(data.module.current, js)
          }
          // 2) Project shared resources
          else if (exists(path.join(appDir(), 'app/javascript', js))) {
            shared = true
            src = path.join(appDir(), 'app/javascript', js)
          }
          // 3) Base module
          else if (exists(path.join(data.module.base, js))) {
            src = path.join(data.module.base, js)
          }
          // 4) Agartha shared resources
          else if (exists(path.join(cwd(), 'app/relics', relic(), 'javascript', js))) {
            shared = true
            src = path.join(cwd(), 'app/relics', relic(), 'javascript', js)
          }
          // 5) Javascript file does not exists
          else {
            let pattern = new RegExp('^(https?:\/\/)?','i')
            // we have an external URL
            if (pattern.test(js)) {
              cdn = true
              type === 'external'
            }
            else {
              log("Javascript file " + js + " not found.", 'error')
            }
          }
          // Javascript as-is (expanded)
          code = read.text(src)
          // check if we need to compress the Javascript file
          if (style === 'compressed') {
            UglifyJSResults = UglifyJS.minify(code, UglifyJSOptions)
            // minified output
            code = result.code
            //minified map output
            map = result.map
          }
          if (type != 'cdn') {
            if (!exists(path.join(appBuildDir(), 'js', basename))) {
              // Copy the Javascript file in the public directory
              let jsFile = path.join(appBuildDir(), 'js', basename)
              if (!exists(jsFile)) {
                if (!_.has(agartha._filemap, jsFile)) {
                  agartha._filemap[jsFile] = true
                  write(jsFile, code)
                }
              }
            }
          }
          if (type === 'external') {
            if (cdn) {
              code = js
            }
            else {
              code = appUrl() + '/' + path.join('js', basename)
            }
          }
          data.closure += _.template(template[type])({ src: code, now: agartha.timespan })
        })
      }
      if (_.isObject(data.assets.hbs)) {
        /** append all the templates to the body */
        _.each(data.assets.hbs, function (hbs) {
          // HBS templates can be in 4 different folders
          // ------------------------------------------------
          // 1) Current module
          // 2) Base module
          // 3) Current site shared resources
          // 4) Agartha shared resources
          // 5) Fail
          // 1) Current module
          if (exists(path.join(data.module.current, hbs.template))) hbs.src = path.join(data.module.current, hbs.template)
          // 2) Base module
          else if (exists(path.join(data.module.base, hbs.template))) hbs.src = path.join(data.module.base, hbs.template)
          // 3) Javascript file does not exists, continue
          else return
          data.closure += compile.hbs(hbs)
        })
      }
    }
    /** CSS / SASS */    
    data.css = css(agartha)

    /** array to hold the menu object */
    // source.menu = []

    /** build the menu object */
    // _.each(pages, (page, index) => {
    //   if (_.isArray(pages[index].menu)) {
    //     _.each(pages[index].menu, (menu) => {
    //       let weight = menu.weight
    //       if (!_.isEmpty(source.menu[weight])) {
    //         weight = source.menu.length + 1
    //       }
    //       source.menu[weight] = {
    //         label: menu.label,
    //         status: 'active',
    //         route: pages[index].route.replace('/index.html', ''),
    //         page: index,
    //         weight: weight
    //       }
    //     })
    //   }
    // })

    /** clean the menu object of empty values that can "exist" becuase of weight */
    // source.menu = _.reject(source.menu, (menu) => {
    //   return _.isUndefined(menu)
    // })

    async function runTask () {
      try {
        
        /** map widgets to the task and load data Object if type is not local */
        data.content = await spaghetti(data.module, data);
        
        log('Transforming ' + route, 'status');
        
        // write HTML file
        await write(path.join(appBuildDir(), route), minify(handlebars_template(data), htmlminifyConfiguration));

        console.log(data)
    
        // write(path.join(appBuildDir(), task + '.json'), JSON.stringify(source, null, 4))

      }
      catch (err) {
        console.log(err);
      }    
    }

    runTask();
    
  }
  catch (error) {
    console.error(error)
  }
}
