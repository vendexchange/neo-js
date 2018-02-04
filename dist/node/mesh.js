/* eslint handle-callback-err: "off" */
/* eslint new-cap: "off" */
const _ = require('lodash')
const Logger = require('../common/logger')

/**
 * @class Mesh
 * @param {Array.<Node>} nodes
 * @param {Object} options
 * @param {Object} options.logger
 */
class Mesh {
  constructor (nodes, options = {}) {
    // -- Properties
    /** @type {Array.<Node>} */
    this.nodes = []
    /** @type {Object} */
    this.defaultOptions = {
      logger: new Logger('Mesh')
    }

    // -- Bootstrap
    Object.assign(this, this.defaultOptions, options)
    this.nodes = nodes
  }

  /**
   * @public
   * @returns {Node}
   */
  getFastestNode () {
    // TODO: make active filter, optional
    return _.minBy(
      _.filter(this.nodes, 'active'),
      'latency'
    )
  }

  /**
   * Identifies and returns the node with the highest block height.
   * @public
   * @returns {Node}
   */
  getHighestNode () {
    // TODO: make active filter, optional
    return _.maxBy(
      _.filter(this.nodes, 'active'),
      'blockHeight'
    )
  }

  /**
   * @public
   * @returns {Node}
   */
  getRandomNode () {
    // TODO: getRandomNode(isActive)
    // This also picks up inactive nodes
    const targetIndex = parseInt(Math.random() * this.nodes.length)
    return this.nodes[targetIndex]
  }

  /**
   * @public
   * @returns {Node}
   */
  getNodeWithBlock (index, sort = 'latency') {
    // NOTE: Not been used
    return _.minBy(
      _.filter(this.nodes, ({index: nIndex, active}) => {
        return active && (index <= nIndex)
      }),
      sort
    )
  }

  /**
   * @public
   * @param {string} method
   * @param {object} params
   * @returns {*}
   */
  rpc (method, params) {
    // Alias of mesh.getHighestNode().rpc()
    return (this.getHighestNode() || this.nodes[0]).rpc[method](params)
  }
}

module.exports = Mesh
