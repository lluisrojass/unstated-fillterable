import React from 'react';
import { Container, Subscribe } from 'unstated';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

var Filterable =
/*#__PURE__*/
function (_Container) {
  _inherits(Filterable, _Container);

  function Filterable() {
    var _this;

    _classCallCheck(this, Filterable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Filterable).call(this));
    var filters = new WeakMap();

    var isNotInternal = function isNotInternal(fnName) {
      return ['registerFilter', 'filter', 'removeFilter', '_unregistered'].indexOf(fnName) === -1;
    };
    /**
     * Attach filters to a function.
     * Function must be a member of the
     * current instance.
     * @param {Function} fn 
     * @param {Any} filter
     * @returns {Function} function that was given
     */


    _this.registerFilter = function (fn, filter) {
      assertFn('fn', fn);
      if (filter == null) throw new TypeError("argument 'filter' is required");
      filters.set(fn, filter);
      return fn;
    };
    /**
     * Iterate through registered functions,
     * classifying target functions.
     * @param {Function} classifier invoked with 
     * a registered function's filter value, must 
     * return a boolean.
     * @returns {Object} populated with passing 
     * functions.
     */


    _this.filter = function (classifier) {
      assertFn('classifier', classifier);
      var selected = {};
      var fnKeys = Object.keys(_assertThisInitialized(_assertThisInitialized(_this))).filter(isNotInternal).filter(function (key) {
        return typeof _this[key] === 'function';
      });
      fnKeys.forEach(function (key) {
        var fn = _this[key];
        var filter = filters.get(fn);
        if (!filter) return;
        if (classifier(filter)) selected[key] = fn;
      });
      return selected;
    };
    /**
     * Remove a registered filter for 
     * a given function.
     * @returns {Boolean} denotes whether 
     * an entry was removed.
     */


    _this.removeFilter = function (fn) {
      assertFn('fn', fn);
      return filters.delete(fn);
    };
    /**
     * Obtain all functions
     * which do not have a 
     * registered filter entry.
     * @returns {Object} contains unregistered
     * functions.
     */


    _this._unregistered = function () {
      var selected = {};
      Object.keys(_assertThisInitialized(_assertThisInitialized(_this))).filter(isNotInternal).filter(function (key) {
        return !filters.has(_this[key]) && typeof _this[key] === 'function';
      }).forEach(function (key) {
        selected[key] = _this[key];
      });
      return selected;
    };

    return _this;
  }

  return Filterable;
}(Container);
/**
 * Decorate a React Component to Subscribe 
 * to containers.
 * @param {Object[]} filterOptions 
 * @param {React.Component} Component 
 * @returns {React.Component} 
 */


var withFilters = function withFilters(filterOptions, Component) {
  var safeOptions;
  if (isObject(filterOptions)) safeOptions = [filterOptions];else if (Array.isArray(filterOptions)) safeOptions = filterOptions;else throw new TypeError("expected argument 'filterOptions' " + "to be of a valid plain object or array, " + "instead got '".concat(filterOptions == null ? 'null' : _typeof(filterOptions), "'"));
  console.log(safeOptions, isObject(filterOptions));
  var containers = safeOptions.map(function (options) {
    if (!(options.container instanceof Container)) throw new TypeError('filterOption.container must be ' + 'a valid unstated container');
    return options.container;
  });
  return function (props) {
    return React.createElement(Subscribe, {
      to: containers
    }, function () {
      var refined = arguments.map(function (container, index) {
        if (!(container instanceof Filterable)) return container;
        var options = safeOptions[index];
        if (!options.filter) return container;
        var filter = options.filter;
        assertFn('filter', filter);
        var filtered = container.filter(filter);
        if (options.passState) filtered.state = container.state;

        if (options.loose) {
          var inverse = container._unregistered();

          Object.assign(filtered, inverse);
        }

        return filtered;
      });
      return React.createElement(Component, _extends({}, refined, props));
    });
  };
};

function isObject(obj) {
  var toString = Object.prototype.toString;
  return toString.call(obj) === toString.call({});
}

function assertFn(argName, arg) {
  if (typeof arg !== 'function') throw new TypeError("expected argument " + "'".concat(argName, "' to be of type 'function', ") + "instead got '".concat(_typeof(arg), "'"));
}

export { Filterable, withFilters };
