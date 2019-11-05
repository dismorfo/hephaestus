'use strict';

const appDir = require('../appDir');
const Handlebars = require('handlebars');
const _ = require('underscore');
const helpers = require('../helpers');
const read = require('../read');
const { minify } = require('html-minifier');
const configurations = require('../configurations');

class Components {
  
  constructor () {
    this.appDir = appDir();
    /** register Handlebars helpers */
    _.each(helpers(), (helper, key) => {
      Handlebars.registerHelper(key, helper);
    });
  }

  use (components) {

    const _componets = {};

    for (const component of components) {
      _componets[component] = this.load(component);
    }

    return _componets;

  }

  load (component) {
    
    const source = require(`${this.appDir}/app/components/${component.toLowerCase()}/index.js`);

    const raw = read.text(`${this.appDir}/app/components/${component.toLowerCase()}/component.hbs`);

    const template = Handlebars.compile(raw);

    return {
      id: source.id,
      html: minify(template(source), configurations.minify())
    };

  }

}

module.exports = Components;
