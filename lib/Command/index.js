'use strict';

const { agartha } = require('hephaestus');

module.exports = exports = class Command {
  
  constructor () {
    this.hephaestus = agartha;
  }

  get command () {
    return '';
  }

  get alias () {
    return false;
  }

  get description () {
    return '';
  }

  get options () {
    return [];
  }

  get onInit () {
    return false;
  }

  get onDone () {
    return false;
  }

  action () {
  }

}
