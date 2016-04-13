"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Util = function () {
  function Util() {
    var logger = arguments.length <= 0 || arguments[0] === undefined ? console : arguments[0];

    _classCallCheck(this, Util);

    this.logger = logger;
  }

  _createClass(Util, [{
    key: 'parseFiles',
    value: function parseFiles(files) {
      this._checkExist(files);

      if (files.length === 1) {
        if (_fs2.default.lstatSync(files[0]).isDirectory()) {
          var dir = files[0];

          if ('/' !== dir.slice(-1)) {
            dir = dir + '/';
          }

          this.logger.log(_chalk2.default.yellow('Retrieving files from ' + dir));
        }
      }

      return files;
    }
  }, {
    key: 'validate',
    value: function validate(args) {
      var username = args.u;
      var password = args.p;
      var repo = args.r;
      var packs = args._;
      var error = false;

      if (username === undefined || username === true) {
        error = true;
      }

      if (password === undefined || password === true) {
        error = true;
      }

      if (repo === undefined || repo === true) {
        error = true;
      }

      if (packs.length === 0) {
        error = true;
      }

      return !error;
    }
  }, {
    key: 'usage',
    value: function usage() {
      var message = "usage: issue-pack -u username -p password -r repo pack1.yml [pack2.yml] [pack3.yml] ...";

      return message;
    }
  }, {
    key: '_checkExist',
    value: function _checkExist(files) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var file = _step.value;

          if (!_fs2.default.existsSync(file)) {
            throw new Error('File `' + file + '` does not exist.');
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return true;
    }
  }]);

  return Util;
}();

exports.default = Util;