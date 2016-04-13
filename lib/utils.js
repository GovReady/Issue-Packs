var chalk = require('chalk');

var Utils = {
  validate: function (args) {
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
  },
  usage: function () {
    var message = "usage: issue-pack -u username -p password -r repo pack1.yml [pack2.yml] [pack3.yml] ...";

    return message;
  }
}

module.exports = Utils;
