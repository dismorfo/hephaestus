/**
 * Log
 *
 * @param {String} path
 * @param {String} status
 * @param {Function} fn
 */
module.exports = exports = function discovery () {
  // https://www.npmjs.com/package/solr-node
  const Discover = require('solr-node')
  const client = new Discover({
    host: 'stagediscovery.dlib.nyu.edu',
    port: '8983',
    core: 'viewer',
    protocol: 'http'
  })
  return client     
}
