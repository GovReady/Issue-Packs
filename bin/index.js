#!/usr/bin/env node

var chalk = require('chalk');
var YAML = require('yamljs');
var IssuePack = require('../lib/IssuePack');
var Util = require('../lib/Util').default;
var prompt = require('prompt');

//Create new Util class
var util = new Util();

var schema = {
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
      description: "repo (username/repo)"
    },
    path: {
      required: true
    }
  }
};

prompt.message = "";

prompt.start();

prompt.get(schema, function (err, result) {
  var username = result.username;
  var password = result.password;
  var repo = result.repo;
  var path = result.path;

  var creds = {
    username: username,
    password: password
  };

  //Retrieve pack files
  var packFiles = util.parseFiles([path]);

  //Iterate through the pack files
  packFiles.forEach(function (file) {
    var issuePack = new IssuePack({
      auth: creds
    });

    var contents = YAML.load(file);

    issuePack.load(contents);

    issuePack.push(repo);
  });
});
