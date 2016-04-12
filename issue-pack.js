#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var chalk = require('chalk');
var GithubAPI = require('github');
var YAML = require('yamljs');

var username = argv.u;
var password = argv.p;
var repo = argv.r;
var packs = argv._;
var error = false;

//Usage logging
function usage () {
  var message = "usage: issue-pack [-u username] [-p password] [-r repo] pack1.yml pack2.yml ...";

  console.log(message);
};

/**
 *  Check arguments
 *
 *  TODO: I'm sure there's a more elegant way to handle this.
 */
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
  usage();
  process.exit(1);
}

var github = new GithubAPI({
  version: "3.0.0",
});

//Check credentials
  //User
  //Password
  //Repo
    //Check repo exists

//Authenticate
// github.authenticate({
//   type: "basic",
//   username: username,
//   password: password
// });

//Parse YAML

  //Milestone
  //Issues
    //Title
    //Description
    //Tags (optional)

//Check Milestone exists in repo
  //If milestone exists
    //Exit
  //Otherwise
    //Create Milestone
      //Create issues

