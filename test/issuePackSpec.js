var expect = require('chai').expect;
var chalk = require('chalk');
var sinon = require('sinon');
var IssuePack = require('../lib/IssuePack');

require('mocha-sinon');

describe("IssuePack", function () {
  var issuePack;
  var logger;
  var github;
  var creds;
  var repo;
  var pack;

  beforeEach(function () {
    logger = {
      log: sinon.spy()
    };

    github = {
      authenticate: sinon.spy(),
      issues: {
        create: function (options, cb) {
          cb(null, {
            data: {
              html_url: 'http://example.com'
            }
          });
        },
        createLabel: function (options, cb) {
          cb(null, {
            data: {
              html_url: 'http://example.com'
            }
          });
        },
        createMilestone: function (options, cb) {
          cb(null, {html_url: 'http://example.com'});
        }
      },

    };

    repo = 'user/repo';

    issuePack = new IssuePack({
      auth: {
        username: 'user',
        password: 'pass'
      }
    }, logger, github);

    pack = {
        'milestone': 'Milestone 1',
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

    // Spy on Github calls
    sinon.spy(github.issues, 'createMilestone');
    sinon.spy(github.issues, 'createLabel');
    sinon.spy(github.issues, 'create');

    //Spy on IssuePack calls
    sinon.spy(issuePack, '_createIssue');
    sinon.spy(issuePack, '_createIssues');
    sinon.spy(issuePack, '_createMilestone');
  });

  describe('#load', function () {

    it('should log milestone name to the console');

    it('should contain the correct milestone title and issue count', function () {
      issuePack.load(pack);

      expect(issuePack.pack.milestone).to.equal('Milestone 1');
      expect(issuePack.pack.issues.length).to.equal(3);
    });
  });

  describe('#push', function () {
    it('should throw an error if no pack is loaded', function () {
      expect(issuePack.push.bind(issuePack, 'push')).to.throw('Cannot push to Github.  Pack contents not loaded.');
    });

    it('should create the milestone', function () {
      issuePack.pack = pack;
      issuePack.push(repo);

      expect(issuePack._createMilestone.callCount).to.equal(1);
    });

    it('should return a Promise');

    it('should accept an existing milestone number to push to');
  });

  describe('#_createIssues', function () {
    it('should create each issue');
  });

  describe('#_createIssue', function () {
    it('should create the labels');
    it('should create the issue');
    it('should log any errors');
  });

  describe('#_createMilestone', function () {
    it('should create the milestone');
    it('should handle existing milestones');
    it('should get the number for an existing milestone');
    it('should log any errors');
    it('should create the issues');
  });

  describe('#_getMilestoneNumber', function () {
    it('should retrieve all milestones');
    it('should log any errors');
    it('should locate correct milestone and return the number');
  });

  describe('#_createLabel', function () {
    it('should return a promise');
    it('should generate a color');
    it('should create the label');
    it('should handle existing labels');
  });

});
