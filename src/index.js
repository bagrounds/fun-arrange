/**
 *
 * @module fun-arrange
 */
;(function () {
  'use strict'

  /* imports */
  var curry = require('fun-curry')

  /* exports */
  module.exports = curry(arrange)

  /**
   *
   * @function module:fun-arrange.arrange
   *
   * @param {Array|Object} shape - array of old indices in a new order
   * @param {Array|Object|Function} source - to get values from
   *
   * @return {Array|Object} in a new order
   */
  function arrange (shape, source) {
    if (shape instanceof Array) {
      return arrangeToArray(shape, source)
    } else {
      return arrangeToObject(shape, source)
    }
  }

  function arrangeToObject (shape, source) {
    return Object.keys(shape).reduce(function (result, key) {
      result[key] = (typeof source === 'function')
        ? source.apply(null, shape[key])
        : source[shape[key]]

      return result
    }, {})
  }

  function arrangeToArray (shape, source) {
    return shape.map(function (key) {
      return (typeof source === 'function')
        ? source.apply(null, key)
        : source[key]
    })
  }
})()

