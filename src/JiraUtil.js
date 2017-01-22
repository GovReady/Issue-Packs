"use strict";

import chalk from 'chalk';

export default class JiraUtil {
  //Set util options
  constructor (util = null) {
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
        projectKey: {
          required: true,
          description: "Jira Project Key (prefixes all issues in project)"
        },
        jiraBaseUri: {
          required: true,
          description: "Jira Base URI (e.g. https://jira.govready.com)"
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
      path: [],
      logger: console,
      json_response: ""
    };
    args.forEach(function (arg) {
      if (util.startsWith(arg, "-t=")) {
        options.tool = arg.split('=', 2)[1];
      } else if (util.startsWith(arg, "-u=")) {
        options.username = arg.split('=', 2)[1];
      } else if (util.startsWith(arg, "-p=")) {
        options.password = arg.split('=', 2)[1];
      } else if (util.startsWith(arg, "-k=")) {
        options.projectKey = arg.split('=', 2)[1];
      } else if (util.startsWith(arg, "-b=")) {
        options.jiraBaseUri= arg.split('=', 2)[1];
      } else if (arg == "--json") {
        options.json_response = {
          log: []
        };
        options.logger = { log: function(msg) { options.json_response.log.push(chalk.stripColor(msg)); } }
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
    var projectKey = args.projectKey;
    var jiraBaseUri = args.jiraBaseUri;
    var path = args.path;

    if (!tool || tool.toUpperCase() !== 'JIRA') {
      error = true;
    }

    if (username === undefined || username === true) {
      error = true;
    }

    if (password === undefined || password === true) {
      error = true;
    }

    if (projectKey === undefined || projectKey === true) {
      error = true;
    }

    if (jiraBaseUri === undefined || jiraBaseUri === true) {
      error = true;
    }

    if (path.length === 0) {
      error = true;
    }

    return !error;
  }

  //Print script usage
  usage() {
    var message = "usage: issue-pack -t=jira -u=username -p=password -k=projectKey -b=baseUri [--json] pack1.yml [pack2.yml] [pack3.yml] ...";

    return message;
  }
}
