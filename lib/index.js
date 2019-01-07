'use strict';

var unstated = require('unstated');
var assert = require('assert');

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

    var isFn = function isFn(fn) {
      return assert.equal(_typeof(fn), 'function', "expected argument 'fn' " + "to be of type 'function', instead got ".concat(_typeof(fn)));
    };

    _this.withFilters = function (fn, filter) {
      isFn(fn);
      assert.ok(filter != null, "argument 'filter' is required");
      filters.set(fn, filter);
      return fn;
    };

    _this.filter = function (classifier) {
      var fns = Object.keys(_assertThisInitialized(_assertThisInitialized(_this))).filter(function (key) {
        return typeof _this[key] === 'function' && ['withFilters', 'filter'].indexOf(key) === -1;
      }).map(function (key) {
        return {
          fn: _this[key],
          name: key
        };
      });
      var selected = {};
      fns.forEach(function (descriptor) {
        var fn = descriptor.fn,
            name = descriptor.name;
        if (!filters.has(fn)) return;
        var filter = filters.get(fn);

        if (classifier(filter)) {
          selected[name] = fn;
        }
      });
      return selected;
    };

    _this.remove = function (fn) {
      return isFn(fn), filters.delete(fn);
    };

    return _this;
  }

  return Filterable;
}(unstated.Container);
