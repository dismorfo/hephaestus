'use strict';

class Command {
  
  constructor () {
  }

  get list () {
    return true;
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

module.exports = Command;