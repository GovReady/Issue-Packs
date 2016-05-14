"use strict";

import axios from 'axios';
import chalk from 'chalk';
import randomstring from 'randomstring';
import {Base64} from 'js-base64';
import Github from 'github-api';

class IssuePack {
  //Set initial options and logger
  constructor (options, logger = console, github) {
    if(!options.auth) {
      throw new Error('Incorrect authorization options');
    }

    this.__github = {};

    this.__auth = {
      token: options.auth.token,
      username: options.auth.username,
      password: options.auth.password
    };

    axios.defaults.headers.common['Accept'] = 'application/vnd.github.v3+json';

    this.__authenticate(this.__auth);
    this.__http = axios.create();
    this.__apiBase = 'https://api.github.com';

    this.logger = logger;
  }

  /**
   *  Loads a pack's contents into the class and logs some stuff
   *  @param { Object } pack - Object representation of an issue pack
   */
  load(pack) {
    this.logger.log(chalk.yellow('Unpacking milestone: ' + pack.milestone));
    this.logger.log(chalk.green(' - ' + pack.issues.length + ' issues unpacked.'));
    this.pack = pack;
  }

  /**
   *  Set authentication headers
   */
  __authenticate(auth) {
    if(this.__auth.token) {
      axios.defaults.headers.common['Authorization'] = 'token ' + this.__auth.token;

      this.__github = new Github({
        token: this.__auth.token
      });
    } else if ( this.__auth.username && this.__auth.password ) {
      axios.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(this.__auth.username + ':' + this.__auth.password);

      this.__github = new Github({
        username: this.__auth.username,
        password: this.__auth.password
      });
    }
  }

  /**
   *  Push issue pack to Github
   */
  push(repo) {
    this.logger.log(chalk.yellow('Pushing milestone to Github'));

    if(!this.pack) {
      throw new Error('Cannot push to Github.  Pack contents not loaded.');
    }

    this._createMilestone(this.pack.milestone, repo, (milestone) => {
      this._createIssues(this.pack.issues, repo, milestone);
    });
  }

  /**
   *  Iterate through issues and create each
   */
  _createIssues(issues, repo, milestone) {
    issues.forEach((issue) => {
      this._createIssue(issue, repo, milestone);
    });
  }

  /**
   * Create each issue on Github
   */
  _createIssue(issue, repo, milestone) {
    var labelPromises = [];

    for ( var i in issue.labels ) {
      var res = this._createLabel(issue.labels[i], repo);

      labelPromises.push(res);
    }

    Promise.all(labelPromises).then(function (resolve, reject) {
      var newIssue = {
        title: issue.title,
        body: issue.body,
        milestone: milestone,
        labels: issue.labels
      };

      this.__http.post(this.__apiBase + "/repos/" + repo + "/issues", newIssue)
        .then(function (res) {
          var data = res.data;
          this.logger.log(chalk.green('Issue created: ' + data.html_url));
        }.bind(this))
        .catch(function (err) {
          this.logger.log(chalk.red('Error: ' + err));
        }.bind(this));
    }.bind(this));
  }

  /**
   *  Create milestone on Github
   */
  _createMilestone(milestone, repo, cb) {
    var milestone = {
      title: milestone
    };

    this.__http.post(this.__apiBase + '/repos/' + repo + '/milestones', milestone)
      .then(function (res) {
        this.logger.log(chalk.green('Milestone created: ' + res.data.html_url));
        cb(res.data.number);
      }.bind(this))
      .catch(function (res) {
        var message = res.data;

        if(message.errors && message.errors.length == 1 && message.errors[0].code == 'already_exists') {
          this.logger.log(chalk.yellow.bold('Milestone `' + milestone.title + '` already exists.  Retrieving id from Github.'));

          this._getMilestoneNumber(milestone,  repo, function (number) {
            cb(number);
          });
        } else {
          this.logger.log(chalk.red('Error: ' + err));
        }
      }.bind(this));
  }

  _getMilestoneNumber(q, repo, cb) {
    this.__http.get(this.__apiBase + '/repos/' + repo + '/milestones')
      .then(function(res) {
        var found = res.data.find(function (milestone) {
          return milestone.title == q.title;
        });

        cb(found.number);
      })
      .catch(function (err) {
        this.logger.log(chalk.red(err.data));
      }.bind(this));
  }

  _createLabel(name, repo, cb, color = null) {
    //If no color is passed, generate a random hex value
    if(!color) {
      color = randomstring.generate({ length: 6, charset: 'hex'});
    }

    return new Promise(function (resolve, reject) {
      this.__http.post(this.__apiBase + '/repos/' + repo + '/labels', {
        name: name,
        color: color
      })
      .then(function (res) {
        this.logger.log(chalk.green('Label `' + name + '` created.'));
        resolve('Label `' + name + '` created.');
      }.bind(this))
      .catch(function (err) {
        var message = err.data;

        if(message.errors && message.errors.length == 1 && message.errors[0].code == 'already_exists') {
          this.logger.log(chalk.yellow.bold('Label `' + name + '` already exists.  Skipping'));

          resolve(err);
        } else {
          this.logger.log(chalk.red('Error: ' + err));
          reject(err);
        }
      }.bind(this));
    }.bind(this));
  }
}

module.exports = IssuePack;
