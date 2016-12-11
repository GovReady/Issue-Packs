"use strict";

import axios from 'axios';
import chalk from 'chalk';
import randomstring from 'randomstring';
import {Base64} from 'js-base64';

var logger = console;

class IssuePackForJira {
  //Set initial options and logger
  constructor (options, logger = console) {
    if(!options.auth) {
      throw new Error('Incorrect authorization options');
    }

    this.__auth = {
      username: options.auth.username,
      password: options.auth.password
    };

    this.__apiBase = options.jiraBaseUri;
    this.__projectKey = options.projectKey;
    this.__http = axios.create();

    logger = logger;
  }

  /**
   *  Loads a pack's contents into the class and logs some stuff
   *  @param { Object } pack - Object representation of an issue pack
   */
  load(pack) {
    logger.log(chalk.yellow('Unpacking pack: ' + pack.name));
    logger.log(chalk.green(' - ' + pack.issues.length + ' issues unpacked.'));
    this.pack = pack;
  }

  /**
   *  Push issue pack to Jira
   */
  push(milestoneNumber = undefined) {
    logger.log(chalk.yellow('Pushing pack to Jira'));

    if(!this.pack) {
      throw new Error('Cannot push to Jira.  Pack contents not loaded.');
    }

    var pushPromise =  new Promise(function (resolve, reject) {
      var issuesPromise = this._createIssues(this.pack.issues);
    }.bind(this));

    return pushPromise;
  }

  /**
   *  Iterate through issues and create each
   */
  _createIssues(issues) {
    var issuePromises = [];

    issues.forEach((issue) => {
      var promise = this._createIssue(issue);
      issuePromises.push(promise);
    });

    return Promise.all(issuePromises)
      .then(function (issues) {
        var success = true;
        issues.forEach(function (issue) {
          if (!issue) {
            success = false;
            return false;
          }
        });

        if (success) {
          logger.log(chalk.green('Issues created successfully'));
        } else {
          logger.log(chalk.red('Error occurred during issues creation'));
        }
      });
  }

  /**
   * Create each issue on Jira
   */
  _createIssue(issue) {

    var normalizedLabels = [];

    for ( var i in issue.labels ) {
      var normalizedLabel = this._normalizeLabel(issue.labels[i]);

      if (normalizedLabel) {
        normalizedLabels.push(normalizedLabel);
      }
    }

    var newIssue = {
      fields: {
        project: {
          key: this.__projectKey
        },
        summary: issue.title,
        description: issue.body,
        labels: normalizedLabels,
        issuetype: {
          name: 'Task'
        }
      }
    };

    return this.__http.post(this.__apiBase + "/rest/api/2/issue/", newIssue, { auth: this.__auth })
      .then(function (res) {
        var data = res.data;
        logger.log(chalk.green('Issue created: ' + data.self));
        return data;
      })
      .catch(function (err) {
        logger.log(chalk.red('Error occurred during issue creation: ' + err));
      });
  }

  /**
   *  Normalize labels for Jira
   *  Jira does not allow labels with spaces
   *
   *  Returns normalized label
   */
  _normalizeLabel(label) {
    var normalizedLabel = null;
    if (label) {
      normalizedLabel = label.split(" ").join("_");
    }
    return normalizedLabel;
  }
}

module.exports = IssuePackForJira;
