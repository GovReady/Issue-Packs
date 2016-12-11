var expect = require('chai').expect;
var chalk = require('chalk');
var sinon = require('sinon');
var IssuePack = require('../lib/IssuePackForJira');

require('mocha-sinon');

describe("IssuePackForJira", function () {
  var issuePack;
  var logger;
  var jira;
  var creds;
  var repo;
  var pack;

  beforeEach(function () {
    logger = {
      log: sinon.spy()
    };

    jira = {
      issues: {
        create: function (options, cb) {
          cb(null, {
            data: {
              self: 'http://example.com'
            }
          });
        }
      }
    };

    issuePack = new IssuePack({
      auth: {
        username: 'user',
        password: 'pass'
      },
      projectKey: 'TEST',
      jiraBaseUri: 'https://example.atlassian.net'
    }, logger, jira);

    pack = {
        'issues': [
          {
            'title': 'Issue 1',
            'body': 'This is the first issue',
            'labels': [
              'Role 1',
              'Role 2'
            ]
          },
          {
            'title': 'Issue 2',
            'body': 'This is the second issue',
            'labels': [
              'Role 3'
            ]
          },
          {
            'title': 'Issue 3',
            'body': 'This is the third issue'
          }
        ]
      };

    // Spy on Jira calls
    sinon.spy(jira.issues, 'create');

    //Spy on IssuePack calls
    sinon.spy(issuePack, '_createIssue');
    sinon.spy(issuePack, '_createIssues');
    sinon.spy(issuePack, '_normalizeLabel');
  });

  describe('#load', function () {

    it('should log milestone name to the console');

    it('should contain the correct milestone title and issue count', function () {
      issuePack.load(pack);

      expect(issuePack.pack.issues.length).to.equal(3);
    });
  });

  describe('#push', function () {
    it('should throw an error if no pack is loaded', function () {
      expect(issuePack.push.bind(issuePack, 'push')).to.throw('Cannot push to Jira.  Pack contents not loaded.');
    });

    it('should return a Promise');
  });

  describe('#_createIssues', function () {
    it('should create each issue');
  });

  describe('#_createIssue', function () {
    it('should create the issue');
    it('should log any errors');
  });

  describe('#_normalizeLabel', function () {
    it('should return normalized label with underscores instead of spaces', function () {
      expect(issuePack._normalizeLabel('TEST Label')).to.equal('TEST_Label');
    });
  });

});
