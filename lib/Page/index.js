'use strict';

class Page {
      
    constructor (data) {
      this.hephaestus = process.agartha;
      this.data = data;
      this.tasks = [];
      // a proxy for our array
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
      this.task = new Proxy(this.tasks, {
        set: (target, property, value) => {
          if (property == 0) { // check for property = 0. 
            // I can check here if the value has ID and ROUTE and return FALSE if not
            this.render(this.hephaestus._.extend(value, this.data));
          }
          return true;
        }
      });
      this.init();
    }

    addTask (data) {
      this.task.push(data)
    }

    render (data) {
      this.hephaestus.emit('task.done', data);
    }

    init () {
    }

}

module.exports = Page 
