#!/usr/bin/env node

var chalk = require('chalk');
var GithubAPI = require('github');
var YAML = require('yamljs');
var IssuePack = require('./lib/IssuePack').default;

console.dir(IssuePack);

//require('dotenv').config();

//Retrieve script arguments
var args = require('minimist')(process.argv.slice(2));

//Import Utils class
var utils = require('./lib/utils');

//Validate input
var valid = utils.validate(args);

//If not valid input, echo usage and exit
if(!valid) {
  console.log(chalk.bold(utils.usage()));
  process.exit();
}

//Set up creds object from input arguments
var creds = {
  username: args.u,
  password: args.p,
  repo: args.r,
};

//Create new github object
var github = new GithubAPI({
  version: "3.0.0",
});

//Retrieve pack files
var packFiles = args._;

//Iterate through the pack files
packFiles.forEach(function (file) {
  var issuePack = new IssuePack({
    github: github,
    creds: creds
  });

  var contents = YAML.load(file);

  issuePack.load(contents);
  issuePack.authenticate();
  issuePack.push();
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

