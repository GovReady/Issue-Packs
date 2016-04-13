"use strict";

import chalk from 'chalk';

export default class IssuePack {
  //Set initial options and logger
  constructor (options, logger = console) {
    this.options = options;
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
   *  Authenticate with Github
   */
  authenticate() {
    this.logger.log(chalk.yellow('Authenticating with Github'));
    this.options.github.authenticate({
      type: 'basic',
      username: this.options.creds.username,
      password: this.options.creds.password
    });
  }

  /**
   *  Push issue pack to Github
   */
  push() {
    this.logger.log(chalk.yellow('Pushing milestone to Github'));

    this._createMilestone(this.pack.milestone, (milestone) => {
      this._createIssues(this.pack.issues, this.options.creds.repo, milestone);
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
    this.options.github.issues.create({
      user: repo.split('/')[0],
      repo: repo.split('/')[1],
      title: issue.title,
      body: issue.body,
      milestone: milestone,
      labels: issue.labels
    }, function (err, data) {
      if(err) {
        this.logger.log(chalk.red('Error: ' + err));
      } else {
        this.logger.log(chalk.green('Issue created: ' + data.html_url));
      }
    }.bind(this));
  }

  /**
   *  Create milestone on Github
   */
  _createMilestone(milestone, cb) {
    return this.options.github.issues.createMilestone({
      user: this.options.creds.repo.split('/')[0],
      repo: this.options.creds.repo.split('/')[1],
      title: milestone
    }, function (err, data) {
      if(err) {
        this.logger.log(chalk.red('Error: ' + err));
      } else {
        this.logger.log(chalk.green('Milestone created: ' + data.html_url));
        cb(data.number);
      }
    }.bind(this));
  }
}
