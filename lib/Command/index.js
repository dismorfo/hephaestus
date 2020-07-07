/**
 * Provide a class to create commands that can be executed by hephaestus-cli
 * 
 * @kind class
 * @example <caption>Create a new command</caption>
 * const { Command } = require('hephaestus');
 * class Example extends Command {
 *   get command () {
 *     return 'example';
 *   }
 *   get description () {
 *     return 'An example';
 *   }
 *   action () {
 *     console.log('Example');
 *   }
 * }
 */
class Command {
  /**
   * Mark command as available to be listed in the help output.
   * @return {boolean=true}
   */
  get list () {
    return true;
  }  
  /**
   * Command name to display in the help output.
   * @return {string}
   */
  get command () {
    return '';
  }

  /**
   * Command alias for use lazy humans (optional).
   * @return {string=null}
   */
  get alias () {
    return null;
  }

  /**
   * Description of what this command do.
   * @return {string=null}
   */
  get description () {
    return '';
  }

  /**
   * @todo
   * @return {array}
   */
  get options () {
    return [];
  }

  /**
   * @todo
   * @return {array}
   */
  get onInit () {
    return false;
  }

  /**
   * @todo
   * @return {array}
   */
  get onDone () {
    return false;
  }

  /**
   * Action/code to run.
   * @return {array}
   */
  action () {
  }

}

module.exports = Command;
