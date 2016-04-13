"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Util = function () {
  function Util() {
    _classCallCheck(this, Util);
  }

  _createClass(Util, [{
    key: "validate",
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
    key: "usage",
    value: function usage() {
      var message = "usage: issue-pack -u username -p password -r repo pack1.yml [pack2.yml] [pack3.yml] ...";

      return message;
    }
  }]);

  return Util;
}();

exports.default = Util;