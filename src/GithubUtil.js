"use strict";

export default class GithubUtil {
  //Set util options
  constructor (util = null, logger = console) {
    this.logger = logger;
    this.util = util;
  }

  promptSchema() {
    return {
      properties: {
        username: {
          required: true
        },
        password: {
          hidden: true,
          required: true
        },
        repo: {
          pattern: /^[a-zA-Z\-]+\/[a-zA-Z\-]+$/,
          message: 'Repo must be in the form of `user/repo`',
          required: true,
          description: "Github Repo (username/repo)"
        },
        path: {
          required: true,
          description: "Path to Issue-Pack File(s) (e.g. examples/example-pack.yml)"
        }
      }
    };
  }

  parse(args) {
    var util = this.util;
    var options = {
      path: []
    };

    args.forEach(function (arg) {
      if (util.startsWith(arg, "-t=")) {
        options.tool = arg.split('=', 2)[1];
      } else if (util.startsWith(arg, "-u=")) {
        options.username = arg.split('=', 2)[1];
      } else if (util.startsWith(arg, "-p=")) {
        options.password = arg.split('=', 2)[1];
      } else if (util.startsWith(arg, "-r=")) {
        options.repo = arg.split('=', 2)[1];
      } else {
        options.path.push(arg);
      }
    });

    options.path = options.path.join(' ');

    return options;
  }

  //Validate input arguments
  validate(args) {
    var error = false;

    var tool = args.tool;
    var username = args.username;
    var password = args.password;
    var repo = args.repo;
    var path = args.path;

    if (!tool || tool.toUpperCase() !== 'GITHUB') {
      error = true;
    }

    if (username === undefined || username === true) {
      error = true;
    }

    if (password === undefined || password === true) {
      error = true;
    }

    if (repo === undefined || repo === true) {
      error = true;
    }

    if (path.length === 0) {
      error = true;
    }

    return !error;
  }

  //Print script usage
  usage() {
    var message = "usage: issue-pack -t=github -u=username -p=password -r=repo pack1.yml [pack2.yml] [pack3.yml] ...";

    return message;
  }
}
