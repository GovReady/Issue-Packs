#!/usr/bin/env node

var fs = require('fs');
var chalk = require('chalk');
var YAML = require('js-yaml');
var IssuePackForGithub = require('../lib/IssuePackForGithub');
var IssuePackForJira = require('../lib/IssuePackForJira');
var Util = require('../lib/Util').default;
var JiraUtil = require('../lib/JiraUtil').default;
var GithubUtil = require('../lib/GithubUtil').default;
var prompt = require('prompt');

//Create new Util class
var util = new Util();
var jiraUtil = new JiraUtil(util);
var githubUtil = new GithubUtil(util);

var toolSchema = util.promptSchema();
var jiraSchema = jiraUtil.promptSchema();
var githubSchema = githubUtil.promptSchema();

var callIssuePacksForGithub = function(options) {
  prompt.get(githubSchema, function (err, result) {
    var username = options.username;
    var password = options.password;
    var repo = options.repo;
    var path = options.path;

    var creds = {
      username: username,
      password: password
    };

    //Retrieve pack files
    var packFiles = util.parseFiles(path);

    //Iterate through the pack files
    packFiles.forEach(function (file) {
      var issuePack = new IssuePackForGithub({
        auth: creds
      });

      var contents = YAML.safeLoad(fs.readFileSync(file, 'utf8'));

      issuePack.load(contents);

      issuePack.push(repo);
    });
  });
};

var callIssuePacksForJira = function(options) {
  var username = options.username;
  var password = options.password;
  var projectKey = options.projectKey ? options.projectKey.toUpperCase() : options.projectKey;
  var jiraBaseUri = options.jiraBaseUri;
  var path = options.path;

  var creds = {
    username: username,
    password: password
  };

  //Retrieve pack files
  var packFiles = util.parseFiles(path);

  //Iterate through the pack files
  var promises = [];
  packFiles.forEach(function (file) {
    var issuePack = new IssuePackForJira({
      auth: creds,
      projectKey: projectKey,
      jiraBaseUri: jiraBaseUri
    });

    var contents = YAML.safeLoad(fs.readFileSync(file, 'utf8'));

    issuePack.load(contents);

    promises.push(issuePack.push());
  });

  Promise.all(promises)
    .then(function(results) {
    }).catch(function(e) {
      console.error(e);
    });
};


var commandLineArguments = process.argv.slice(2);

if (commandLineArguments.length > 0) {
  var parsedCommandLineArguments = util.parse(commandLineArguments);
  var valid = util.validate(parsedCommandLineArguments);

  if (valid) {
    if (parsedCommandLineArguments.tool.toUpperCase() === 'JIRA') {
      parsedCommandLineArguments = jiraUtil.parse(commandLineArguments);
      var jiraValid = jiraUtil.validate(parsedCommandLineArguments);

      if (jiraValid) {
        callIssuePacksForJira(parsedCommandLineArguments);
      } else {
        console.error(jiraUtil.usage());
      }
    } else {
      parsedCommandLineArguments = githubUtil.parse(commandLineArguments);
      var githubValid = githubUtil.validate(parsedCommandLineArguments);

      if (githubValid) {
        callIssuePacksForGithub(parsedCommandLineArguments);
      } else {
        console.error(githubUtil.usage());
      }
    }
  } else {
    console.error(util.usage());
    console.error('When using command line arguments, the tool parameter (-t) is required. Where [toolName] is jira or github');
  }

} else {
  prompt.message = "";
  prompt.start();

  prompt.get(toolSchema, function (toolPromptErr, toolPromptResult) {
    if (toolPromptResult.tool &&  toolPromptResult.tool.toUpperCase() === 'JIRA') {
      prompt.get(jiraSchema, function (err, result) {
        callIssuePacksForJira(result);
      });
    } else {
      prompt.get(githubSchema, function (err, result) {
        callIssuePacksForGithub(result);
      });
    }
  });
}
