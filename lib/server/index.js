/**
 * server
 */
module.exports = exports = function server () {
  const fs = require('fs')
  const path = require('path')
  const { spawn } = require('child_process')
  const appBuildDir = require('../appBuildDir')
  const appDir = require('../appDir')
  const exit = require('../exit')  
  const app_build_dir = appBuildDir()
  const app_dir = appDir()  
  try {

   // const app = `${appDir}/app/commands/server/server.js`
   // const out = fs.openSync(`${appDir}/app/logs/out.log`, 'a')
   // const err = fs.openSync(`${appDir}/app/logs/out.log`, 'a')    
   // spawn('node', [app], {
   //   stdio: [ 'ignore', out, err ],
   //   detached: true
   //}).unref()
   
   console.log(app_build_dir)
   console.log(app_dir)
   
  } catch (e) {
    console.log(e)
    exit(e)
  }
}
