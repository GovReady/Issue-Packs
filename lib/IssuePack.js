"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _randomstring = require('randomstring');

var _randomstring2 = _interopRequireDefault(_randomstring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  //Set initial options and logger

  function _class(options) {
    var logger = arguments.length <= 1 || arguments[1] === undefined ? console : arguments[1];

    _classCallCheck(this, _class);

    this.options = options;
    this.logger = logger;
  }

  /**
   *  Loads a pack's contents into the class and logs some stuff
   *  @param { Object } pack - Object representation of an issue pack
   */


  _createClass(_class, [{
    key: 'load',
    value: function load(pack) {
      this.logger.log(_chalk2.default.yellow('Unpacking milestone: ' + pack.milestone));
      this.logger.log(_chalk2.default.green(' - ' + pack.issues.length + ' issues unpacked.'));
      this.pack = pack;
    }

    /**
     *  Authenticate with Github
     */

  }, {
    key: 'authenticate',
    value: function authenticate(options) {
      if (options.type === undefined) {
        throw new Error('No authentication type specified');
      }

      this.logger.log(_chalk2.default.yellow('Authenticating with Github'));

      switch (options.type) {
        case 'oauth':
          this.options.github.authenticate({
            type: 'oauth',
            token: options.token
          });
        default:
          this.options.github.authenticate({
            type: 'basic',
            username: options.creds.username,
            password: options.creds.password
          });
      }
    }

    /**
     *  Push issue pack to Github
     */

  }, {
    key: 'push',
    value: function push(repo) {
      var _this = this;

      this.logger.log(_chalk2.default.yellow('Pushing milestone to Github'));

      if (!this.pack) {
        throw new Error('Cannot push to Github.  Pack contents not loaded.');
      }

      this._createMilestone(this.pack.milestone, repo, function (milestone) {
        _this._createIssues(_this.pack.issues, repo, milestone);
      });
    }

    /**
     *  Iterate through issues and create each
     */

  }, {
    key: '_createIssues',
    value: function _createIssues(issues, repo, milestone) {
      var _this2 = this;

      issues.forEach(function (issue) {
        _this2._createIssue(issue, repo, milestone);
      });
    }

    /**
     * Create each issue on Github
     */

  }, {
    key: '_createIssue',
    value: function _createIssue(issue, repo, milestone) {

      var labelPromises = [];

      for (var i in issue.labels) {
        var res = this._createLabel(issue.labels[i], repo);

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
          if (err) {
            this.logger.log(_chalk2.default.red('Error: ' + err));
          } else {
            this.logger.log(_chalk2.default.green('Issue created: ' + data.html_url));
          }
        }.bind(this));
      }.bind(this));
    }

    /**
     *  Create milestone on Github
     */

  }, {
    key: '_createMilestone',
    value: function _createMilestone(milestone, repo, cb) {
      return this.options.github.issues.createMilestone({
        user: repo.split('/')[0],
        repo: repo.split('/')[1],
        title: milestone
      }, function (err, data) {
        if (err) {
          var message = JSON.parse(err);

          if (message.errors && message.errors.length === 1 && message.errors[0].code == 'already_exists') {
            this.logger.log(_chalk2.default.yellow.bold('Milestone `' + milestone + '` already exists.  Retrieving id from Github.'));

            this._getMilestoneNumber(milestone, repo, function (number) {
              cb(number);
            });
          } else {
            this.logger.log(_chalk2.default.red('Error: ' + err));
          }
        } else {
          this.logger.log(_chalk2.default.green('Milestone created: ' + data.html_url));
          cb(data.number);
        }
      }.bind(this));
    }
  }, {
    key: '_getMilestoneNumber',
    value: function _getMilestoneNumber(name, repo, cb) {
      var milestones = this.options.github.issues.getAllMilestones({
        user: repo.split('/')[0],
        repo: repo.split('/')[1]
      }, function (err, data) {
        if (err) {
          this.logger.log(_chalk2.default.red(err));
        } else {
          var found = data.find(function (milestone) {
            return milestone.title == name;
          });

          cb(found.number);
        }
      });
    }
  }, {
    key: '_createLabel',
    value: function _createLabel(name, repo, cb) {
      var color = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

      //If no color is passed, generate a random hex value
      if (!color) {
        color = _randomstring2.default.generate({ length: 6, charset: 'hex' });
      }

      //Create the label
      return new Promise(function (resolve, reject) {
        this.options.github.issues.createLabel({
          user: repo.split('/')[0],
          repo: repo.split('/')[1],
          name: name,
          color: color
        }, function (err, data) {
          if (err) {
            var message = JSON.parse(err);

            if (message.errors && message.errors.length === 1 && message.errors[0].code == 'already_exists') {
              this.logger.log(_chalk2.default.yellow.bold('Label `' + name + '` already exists.  Skipping'));

              resolve(err);
            } else {
              this.logger.log(_chalk2.default.red('Error: ' + err));
              reject(err);
            }
          } else {

            this.logger.log(_chalk2.default.green('Label `' + name + '` created.'));
            resolve('Label `' + name + '` created.');
          }
        }.bind(this));
      }.bind(this));
    }
  }]);

  return _class;
}();

exports.default = _class;