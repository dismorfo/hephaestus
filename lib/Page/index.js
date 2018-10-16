'use strict';

class Page {

    constructor (data) {
      this.hephaestus = process.agartha;
      this.data = data;
      this.data.assets = {
        js: [],
        ts: [],
        css: [],
        template: []
      }
      this.tasks = [];
      this.task = new Proxy(this.tasks, {
        set: (target, property, value) => {
          if (property == 0) { // check for property = 0. 
            // I can check here if the value has ID and ROUTE and return FALSE if not
            if (this.hephaestus._.isUndefined(value.id)) {
              return true;
            }
            if (this.hephaestus._.isUndefined(value.route)) {
              return true;
            }
            this.hephaestus.emit('task.done', this.hephaestus._.extend(value, this.data));
          }
          return true;
        }
      });
      this.init();
    }

    addTS (data) {
      this.data.assets.ts.push(data)
    }

    addJS (data) {
      this.data.assets.js.push(data)
    }

    addCSS (data) {
      this.data.assets.css.push(data)
    }

    addTemplate (data) {
      this.data.assets.template.push(data)
    }

    render (data) {
      this.task.push(data)
    }

    init () {
    }

}

module.exports = Page 
