'use strict';

const _ = require('underscore');

class Page {
  constructor (data) {
    this.data = data;
    this.data.assets = {
      js: [],
      ts: [],
      css: [],
      template: []
    };
    this.tasks = [];
    this.task = new Proxy(this.tasks, {
      set: (target, property, value) => {
        if (property == 0) { // check for property = 0. 
          // I can check here if the value has ID and ROUTE and return FALSE if not
          if (_.isUndefined(value.id)) {
            return true;
          }
          if (_.isUndefined(value.route)) {
            return true;
          }
          this.build(_.extend(value, this.data));
        }
        return true;
      }
    });
    this.init();
  }

  addTS (data) {
    this.data.assets.ts.push(data);
  }

  addJS (data) {
    if (_.isArray(data)) {
      _.each(data, item => {
        this.data.assets.js.push(item);
      });
    }
    else {
      this.data.assets.js.push(data);
    }        
  }

  addCSS (data) {
    if (_.isArray(data)) {
      _.each(data, item => {
        this.data.assets.css.push(item);
      });
    }
    else {
      this.data.assets.css.push(data);
    }    
  }

  addTemplate (data) {
    this.data.assets.template.push(data);
  }

  render (data) {
    this.task.push(data);
  }

  build (data) {
    const { html } = require('../html');
    html(data);
  }
  
  init () {
  }

}

module.exports = Page;
