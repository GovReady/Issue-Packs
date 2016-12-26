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
  //Set util options
  function Util() {
    var logger = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : console;

    _classCallCheck(this, Util);

    this.logger = logger;
  }

  _createClass(Util, [{
    key: 'promptSchema',
    value: function promptSchema() {
      return {
        properties: {
          tool: {
            required: true
          }
        }
      };
    }

    // List of files separated by white space

  }, {
    key: 'parseFiles',
    value: function parseFiles(stringListOfFiles) {

      var files = stringListOfFiles.split(' ');

      //Ensure that the input files or directory exist
      this._checkExist(files);

      //If there's only one input
      if (files.length === 1) {
        //Check if it's a directory and parse directory,
        //Otherwise just return the files array
        if (_fs2.default.lstatSync(files[0]).isDirectory()) {
          var dir = files[0];

          var dirFiles = _fs2.default.readdirSync(dir);

          if ('/' !== dir.slice(-1)) {
            dir = dir + '/';
          }

          this.logger.log(_chalk2.default.yellow('Retrieved files from `' + dir + '`'));

          var paths = dirFiles.map(function (file) {
            var path = dir + file;

            return path;
          });

          return paths;
        }
      }

      return files;
    }
  }, {
    key: 'parse',
    value: function parse(args) {
      var options = {};
      var util = this;
      args.forEach(function (arg) {
        if (util.startsWith(arg, "-t=")) {
          options.tool = arg.split('=', 2)[1];
        }
      });
      return options;
    }
  }, {
    key: 'startsWith',
    value: function startsWith(str, prefix) {
      return str.substr(0, prefix.length) == prefix;
    }

    //Validate input arguments

  }, {
    key: 'validate',
    value: function validate(args) {
      var error = false;

      var tool = args.tool;

      if (tool === undefined || tool === true) {
        error = true;
      }

      return !error;
    }

    //Print script usage

  }, {
    key: 'usage',
    value: function usage() {
      var message = "usage: issue-pack -t=[toolName]";

      return message;
    }

    //Check input files or directory exist

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