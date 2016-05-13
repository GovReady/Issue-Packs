#!/usr/bin/env node

var chalk = require('chalk');
var YAML = require('yamljs');
var IssuePack = require('../lib/IssuePack');
var Util = require('../lib/Util').default;

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
  password: args.p
};

var repo = args.r;

//Retrieve pack files
var packFiles = util.parseFiles(args._);

//Iterate through the pack files
packFiles.forEach(function (file) {
  var issuePack = new IssuePack({
    auth: creds
  });

  var contents = YAML.load(file);

  issuePack.load(contents);

  issuePack.push(repo);
});
