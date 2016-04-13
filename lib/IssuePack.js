"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IssuePack = function () {
  function IssuePack(options) {
    var logger = arguments.length <= 1 || arguments[1] === undefined ? console : arguments[1];

    _classCallCheck(this, IssuePack);

    this.options = options;
    this.logger = logger;
  }

  _createClass(IssuePack, [{
    key: 'load',
    value: function load(pack) {
      this.logger.log(_chalk2.default.green('Unpacking milestone: ' + pack.milestone));
    }
  }, {
    key: 'authenticate',
    value: function authenticate() {
      this.logger.log(_chalk2.default.green('Authenticating with Github'));
    }
  }, {
    key: 'push',
    value: function push() {
      this.logger.log(_chalk2.default.green('Pushing milestone to Github'));
    }
  }, {
    key: 'toObject',
    value: function toObject() {
      return {
        github: this.options.github,
        creds: this.options.creds,
        pack: this.options.pack
      };
    }
  }]);

  return IssuePack;
}();

exports.default = IssuePack;