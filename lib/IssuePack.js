"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _randomstring = require('randomstring');

var _randomstring2 = _interopRequireDefault(_randomstring);

var _jsBase = require('js-base64');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IssuePack = function () {
  //Set initial options and logger

  function IssuePack(options) {
    var logger = arguments.length <= 1 || arguments[1] === undefined ? console : arguments[1];
    var github = arguments[2];

    _classCallCheck(this, IssuePack);

    if (!options.auth) {
      throw new Error('Incorrect authorization options');
    }

    this.__auth = {
      token: options.auth.token,
      username: options.auth.username,
      password: options.auth.password
    };

    _axios2.default.defaults.headers.common['Accept'] = 'application/vnd.github.v3+json';

    this.__authenticate(this.__auth);
    this.__http = _axios2.default.create();
    this.__apiBase = 'https://api.github.com';

    this.logger = logger;
  }

  /**
   *  Loads a pack's contents into the class and logs some stuff
   *  @param { Object } pack - Object representation of an issue pack
   */


  _createClass(IssuePack, [{
    key: 'load',
    value: function load(pack) {
      this.logger.log(_chalk2.default.yellow('Unpacking milestone: ' + pack.milestone));
      this.logger.log(_chalk2.default.green(' - ' + pack.issues.length + ' issues unpacked.'));
      this.pack = pack;
    }

    /**
     *  Set authentication headers
     */

  }, {
    key: '__authenticate',
    value: function __authenticate(auth) {
      if (this.__auth.token) {
        _axios2.default.defaults.headers.common['Authorization'] = 'token ' + this.__auth.token;
      } else if (this.__auth.username && this.__auth.password) {
        _axios2.default.defaults.headers.common['Authorization'] = 'Basic ' + _jsBase.Base64.encode(this.__auth.username + ':' + this.__auth.password);
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

      Promise.all(labelPromises).then(function (resolve, reject) {
        var newIssue = {
          title: issue.title,
          body: issue.body,
          milestone: milestone,
          labels: issue.labels
        };

        this.__http.post(this.__apiBase + "/repos/" + repo + "/issues", newIssue).then(function (res) {
          var data = res.data;
          this.logger.log(_chalk2.default.green('Issue created: ' + data.html_url));
        }.bind(this)).catch(function (err) {
          this.logger.log(_chalk2.default.red('Error: ' + err));
        }.bind(this));
      }.bind(this));
    }

    /**
     *  Create milestone on Github
     */

  }, {
    key: '_createMilestone',
    value: function _createMilestone(milestone, repo, cb) {
      var milestone = {
        title: milestone
      };

      this.__http.post(this.__apiBase + '/repos/' + repo + '/milestones', milestone).then(function (res) {
        this.logger.log(_chalk2.default.green('Milestone created: ' + res.data.html_url));
        cb(res.data.number);
      }.bind(this)).catch(function (res) {
        var message = res.data;

        if (message.errors && message.errors.length == 1 && message.errors[0].code == 'already_exists') {
          this.logger.log(_chalk2.default.yellow.bold('Milestone `' + milestone.title + '` already exists.  Retrieving id from Github.'));

          this._getMilestoneNumber(milestone, repo, function (number) {
            cb(number);
          });
        } else {
          this.logger.log(_chalk2.default.red('Error: ' + err));
        }
      }.bind(this));
    }
  }, {
    key: '_getMilestoneNumber',
    value: function _getMilestoneNumber(q, repo, cb) {
      this.__http.get(this.__apiBase + '/repos/' + repo + '/milestones').then(function (res) {
        var found = res.data.find(function (milestone) {
          return milestone.title == q.title;
        });

        cb(found.number);
      }).catch(function (err) {
        this.logger.log(_chalk2.default.red(err.data));
      }.bind(this));
    }
  }, {
    key: '_createLabel',
    value: function _createLabel(name, repo, cb) {
      var color = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

      //If no color is passed, generate a random hex value
      if (!color) {
        color = _randomstring2.default.generate({ length: 6, charset: 'hex' });
      }

      return new Promise(function (resolve, reject) {
        this.__http.post(this.__apiBase + '/repos/' + repo + '/labels', {
          name: name,
          color: color
        }).then(function (res) {
          this.logger.log(_chalk2.default.green('Label `' + name + '` created.'));
          resolve('Label `' + name + '` created.');
        }.bind(this)).catch(function (err) {
          var message = err.data;

          if (message.errors && message.errors.length == 1 && message.errors[0].code == 'already_exists') {
            this.logger.log(_chalk2.default.yellow.bold('Label `' + name + '` already exists.  Skipping'));

            resolve(err);
          } else {
            this.logger.log(_chalk2.default.red('Error: ' + err));
            reject(err);
          }
        }.bind(this));
      }.bind(this));
    }
  }]);

  return IssuePack;
}();

module.exports = IssuePack;