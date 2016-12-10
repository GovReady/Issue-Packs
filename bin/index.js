#!/usr/bin/env node

var chalk = require('chalk');
var YAML = require('yamljs');
var IssuePackForGithub = require('../lib/IssuePackForGithub');
var IssuePackForJira = require('../lib/IssuePackForJira');
var Util = require('../lib/Util').default;
var prompt = require('prompt');

//Create new Util class
var util = new Util();

var toolSchema = {
  properties: {
    tool: {
      required: true
    }
  }
};

var jiraSchema = {
  properties: {
    username: {
      required: true
    },
    password: {
      hidden: true,
      required: true
    },
    projectKey: {
      required: true
    },
    jiraUri: {
      required: true,
      description: "JIRA URI (e.g. https://jira.govready.com)"
    },
    path: {
      required: true
    }
  }
};

var githubSchema = {
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

prompt.get(toolSchema, function (toolPromptErr, toolPromptResult) {
  if (toolPromptResult.tool &&  toolPromptResult.tool.toUpperCase() === 'JIRA') {
    prompt.get(jiraSchema, function (err, result) {
      var username = result.username;
      var password = result.password;
      var projectKey = result.projectKey;
      var jiraUri = result.jiraUri;
      var path = result.path;

      var creds = {
        username: username,
        password: password
      };

      //Retrieve pack files
      var packFiles = util.parseFiles([path]);

      //Iterate through the pack files
      packFiles.forEach(function (file) {
        var issuePack = new IssuePackForJira({
          auth: creds,
          projectKey: projectKey,
          jiraUri: jiraUri
        });

        var contents = YAML.load(file);

        issuePack.load(contents);

        issuePack.push();
      });
    });
  } else {
    prompt.get(githubSchema, function (err, result) {
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
        var issuePack = new IssuePackForGithub({
          auth: creds
        });

        var contents = YAML.load(file);

        issuePack.load(contents);

        issuePack.push(repo);
      });
    });
  }
});

