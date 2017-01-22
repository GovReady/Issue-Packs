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

var logger = console;

var IssuePackForJira = function () {
  //Set initial options and logger
  function IssuePackForJira(options) {
    var logger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : console;

    _classCallCheck(this, IssuePackForJira);

    if (!options.auth) {
      throw new Error('Incorrect authorization options');
    }

    this.__auth = {
      username: options.auth.username,
      password: options.auth.password
    };

    this.__apiBase = options.jiraBaseUri;
    this.__projectKey = options.projectKey;
    this.__http = _axios2.default.create();

    logger = logger;
  }

  /**
   *  Loads a pack's contents into the class and logs some stuff
   *  @param { Object } pack - Object representation of an issue pack
   */


  _createClass(IssuePackForJira, [{
    key: 'load',
    value: function load(pack) {
      logger.log(_chalk2.default.yellow('Unpacking pack: ' + pack.name));
      logger.log(_chalk2.default.green(' - ' + pack.issues.length + ' issues unpacked.'));
      this.pack = pack;
    }

    /**
     *  Push issue pack to Jira
     */

  }, {
    key: 'push',
    value: function push() {
      logger.log(_chalk2.default.yellow('Pushing pack to Jira'));

      if (!this.pack) {
        throw new Error('Cannot push to Jira.  Pack contents not loaded.');
      }

      var pushPromise = new Promise(function (resolve, reject) {
        this._createIssues(this.pack.issues).then(resolve).catch(reject);
      }.bind(this));

      return pushPromise;
    }

    /**
     *  Iterate through issues and create each
     */

  }, {
    key: '_createIssues',
    value: function _createIssues(issues) {
      var _this = this;

      var issuePromises = [];

      issues.forEach(function (issue) {
        var promise = _this._createIssue(issue);
        issuePromises.push(promise);
      });

      return Promise.all(issuePromises).then(function (issues) {
        var success = true;
        issues.forEach(function (issue) {
          if (!issue) {
            success = false;
            return false;
          }
        });

        if (success) {
          logger.log(_chalk2.default.green('Issues created successfully'));
        } else {
          logger.log(_chalk2.default.red('Error occurred during issues creation'));
        }
      });
    }

    /**
     * Create each issue on Jira
     */

  }, {
    key: '_createIssue',
    value: function _createIssue(issue) {

      var normalizedLabels = [];

      for (var i in issue.labels) {
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

      return this.__http.post(this.__apiBase + "/rest/api/2/issue/", newIssue, { auth: this.__auth }).then(function (res) {
        var data = res.data;
        logger.log(_chalk2.default.green('Issue created: ' + data.self));
        return data;
      }).catch(function (err) {
        logger.log(_chalk2.default.red('Error occurred during issue creation: ' + err));
      });
    }

    /**
     *  Normalize labels for Jira
     *  Jira does not allow labels with spaces
     *
     *  Returns normalized label
     */

  }, {
    key: '_normalizeLabel',
    value: function _normalizeLabel(label) {
      var normalizedLabel = null;
      if (label) {
        normalizedLabel = label.split(" ").join("_");
      }
      return normalizedLabel;
    }
  }]);

  return IssuePackForJira;
}();

module.exports = IssuePackForJira;