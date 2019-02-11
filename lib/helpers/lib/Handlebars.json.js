'use strict';

function json (context, options) {
  try {
    const data = JSON.parse(context);
    return options.fn(data);
  }
  catch (error) {
    console.log(error);
  }
}

module.exports = json; 

