#!/usr/bin/env node

var chalk = require('chalk');
var GithubAPI = require('github');
var YAML = require('yamljs');
var IssuePack = require('./lib/IssuePack').default;
var Util = require('./lib/Util').default;

//Retrieve script arguments
var args = require('minimist')(process.argv.slice(2));

//Create new Util class
var util = new Util();

//Validate input
var valid = util.validate(args);

//If not valid input, echo usage and exit
if(!valid) {
  console.log(chalk.bold(util.usage()));
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
