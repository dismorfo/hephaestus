/**
 * isProject
 */
module.exports = exports = function isProject () {
  const path = require('path')
  const appDir = require('../appDir')
  const exists = require('../exists')
  const read = require('../read')
  const app_dir = appDir()
  if (exists(path.join(app_dir, 'project.json'))) {
    let data = read.json(path.join(app_dir, 'project.json'))
    return data
  }
  return false
}
