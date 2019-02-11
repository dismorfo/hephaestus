'use strict';

const getSlug = require('speakingurl');

function speakingurl (context, options) {
  return getSlug(this.label);
}

module.exports = speakingurl; 
