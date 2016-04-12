var chalk = require('chalk');

var Utils = {
  _usage: function () {
    var message = "usage: issue-pack [-u username] [-p password] [-r repo] pack1.yml pack2.yml ...";
    console.log(message);
  },
  validate: function (args) {
    var username = args.u;
    var password = args.p;
    var repo = args.r;
    var packs = args._;

    if (username === undefined || username === true) {
      console.log(chalk.red('Username required.'));
      error = true;
    }

    if (password === undefined || password === true) {
      console.log(chalk.red('Password required.'));
      error = true;
    }

    if (repo === undefined || repo === true) {
      console.log(chalk.red('Repo required.'));
      error = true;
    }

    if (packs.length === 0) {
      console.log(chalk.red('At least one issue pack required.'));
      error = true;
    }

    if(error) {
      this._usage();
      process.exit(1);
    }

    return error;
  }
}

module.exports = Utils;
