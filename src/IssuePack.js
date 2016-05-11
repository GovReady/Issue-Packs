"use strict";

import chalk from 'chalk';
import randomstring from 'randomstring';

export default class {
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

    if(!this.pack) {
      throw new Error('Cannot push to Github.  Pack contents not loaded.');
    }

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

    var labelPromises = [];

    for ( var i in issue.labels ) {
      var res = this._createLabel(issue.labels[i]);

      labelPromises.push(res);
    }

    Promise.all(labelPromises).then(function () {
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
        var message = JSON.parse(err);

        if(message.errors && message.errors.length === 1 && message.errors[0].code == 'already_exists') {
          this.logger.log(chalk.yellow.bold('Milestone `' + milestone + '` already exists.  Retrieving id from Github.'));

          this._getMilestoneNumber(milestone, function (number) {
            cb(number);
          });
        } else {
          this.logger.log(chalk.red('Error: ' + err));
        }
      } else {
        this.logger.log(chalk.green('Milestone created: ' + data.html_url));
        cb(data.number);
      }
    }.bind(this));
  }

  _getMilestoneNumber(name, cb) {
    var milestones = this.options.github.issues.getAllMilestones({
      user: this.options.creds.repo.split('/')[0],
      repo: this.options.creds.repo.split('/')[1]
    }, function (err, data) {
      if(err) {
        this.logger.log(chalk.red(err));
      } else {
        var found = data.find(function (milestone) {
          return milestone.title == name;
        });

        cb(found.number);
      }
    });
  }

  _createLabel(name, cb, color = null) {
    //If no color is passed, generate a random hex value
    if(!color) {
      color = randomstring.generate({ length: 6, charset: 'hex'});
    }

    //Create the label
    return new Promise(function (resolve, reject) {
      this.options.github.issues.createLabel({
        user: this.options.creds.repo.split('/')[0],
        repo: this.options.creds.repo.split('/')[1],
        name: name,
        color: color
      }, function (err, data) {
        if(err) {
          var message = JSON.parse(err);

          if(message.errors && message.errors.length === 1 && message.errors[0].code == 'already_exists') {
            this.logger.log(chalk.yellow.bold('Label `' + name + '` already exists.  Skipping'));

            resolve(err);
          } else {
            this.logger.log(chalk.red('Error: ' + err));
            reject(err);
          }
        } else {

          this.logger.log(chalk.green('Label `' + name + '` created.'));
          resolve('Label `' + name + '` created.');
        }
      }.bind(this));
    }.bind(this));
  }
}
