(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
funArrange = require('../src')


},{"../src":4}],2:[function(require,module,exports){
/**
 *
 * @module fun-curry
 */
;(function () {
  'use strict'

  /* imports */
  var stringify = require('./lib/stringify-anything')

  /* exports */
  module.exports = curry

  /**
   *
   * @function module:fun-curry.curry
   *
   * @param {Function} f - function to curry
   * @param {Number} [arity] - number of arguments f should accept
   * @param {Array} [args] - initial arguments to apply
   *
   * @return {Function} a_1 -> a_2 -> ... -> a_arity -> f(a_1, ..., a_arity)
   */
  function curry (f, arity, args) {
    arity = arity || f.length
    args = args || []

    checkInputs(f, arity, args)

    return setProp('name', partialName(f, args, arity),
      setProp('length', arity, function () {
        var newPartialArgs = Array.prototype.slice.call(arguments)

        var newArgs = args.concat(
          newPartialArgs.length ? newPartialArgs : [undefined]
        )

        return newArgs.length >= arity
          ? f.apply(null, newArgs)
          : setProp('length', arity - newArgs.length, curry(f, arity, newArgs))
      })
    )
  }

  function checkInputs (f, arity, args) {
    if (typeof f !== 'function') {
      throw Error(stringify(f) + ' should be a function')
    }

    if (typeof arity !== 'number') {
      throw Error(stringify(arity) + ' should be a number')
    }

    if (!(args instanceof Array)) {
      throw Error(stringify(args) + ' should be an Array')
    }
  }

  function partialName (f, args, n) {
    return f.name
      ? f.name + stringifyArgs(args, n)
      : stringifyArgs(args, n) + '=>'
  }

  function stringifyArgs (args, n) {
    return '(' + args
      .map(stringify)
      .concat(
        Array.apply(null, { length: n - args.length }).map(function () {
          return ''
        })
      ).join(',') + ')'
  }

  function setProp (key, value, target) {
    return Object.defineProperty(target, key, { value: value })
  }
})()


},{"./lib/stringify-anything":3}],3:[function(require,module,exports){
;(function () {
  'use strict'

  /* exports */
  module.exports = stringify

  /**
   *
   * @function module:stringify-anything.stringify
   *
   * @param {*} anything - to stringify
   *
   * @return {String} representation of anything
   */
  function stringify (anything) { // eslint-disable-line max-statements
    if (isPrimitive(anything)) {
      return JSON.stringify(anything)
    }

    if (anything === undefined) {
      return 'undefined'
    }

    if (anything instanceof Function) {
      return anything.name
        ? anything.name +
        '(' + repeat(anything.length, '').join(',') + ')'
        : '(' + repeat(anything.length, '').join(',') + ')=>'
    }

    if (anything instanceof RegExp || anything instanceof Error) {
      return anything.toString()
    }

    if (anything instanceof Array) {
      return '[' + anything.map(stringify).join(',') + ']'
    }

    return '{' +
      zipWith(
        join,
        Object.keys(anything),
        values(anything).map(stringify)
      ).join(',') +
      '}'
  }

  function isPrimitive (x) {
    return x === null ||
      typeof x === 'boolean' ||
      typeof x === 'number' ||
      typeof x === 'string'
  }

  function repeat (n, s) {
    return Array.apply(null, { length: n }).map(function () {
      return s
    })
  }

  function zipWith (f, a1, a2) {
    return a1.map(function (e, i) {
      return f(e, a2[i])
    })
  }

  function values (object) {
    return Object.keys(object).map(function (key) {
      return object[key]
    })
  }

  function join (key, value) {
    return key + ':' + value
  }
})()


},{}],4:[function(require,module,exports){
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


},{"fun-curry":2}]},{},[1]);
