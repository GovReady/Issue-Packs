#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var chalk = require('chalk');
var GithubAPI = require('github');
var YAML = require('yamljs');
var utils = require('./lib/utils');

utils.validate(argv);

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

