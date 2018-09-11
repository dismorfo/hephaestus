/**
 * Log
 *
 * @param {String} path
 * @param {String} status
 * @param {Function} fn
 */

// https://github.com/Leonidas-from-XIV/node-xml2js
const xml = require('xml2js').parseString

function json (filePath) {
  try {
    return JSON.parse(this.text(filePath))
  }
  catch (error) {
    console.log(error)
  }
}

function text (filePath) {
  const fs = require('fs')
  const exists = require('../exists')
  if (exists(filePath)) {
    try {
      return fs.readFileSync(filePath, 'utf-8')
    }
    catch (error) {
      console.log(error)
    }
  }
}

const read = {
  xml: xml,
  json: json,
  text: text
}

module.exports = exports = read
