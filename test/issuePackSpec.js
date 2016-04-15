var expect = require('chai').expect;
var chalk = require('chalk');
var sinon = require('sinon');
var IssuePack = require('../lib/IssuePack').default;

require('mocha-sinon');

describe("IssuePack", function () {
  var issuePack;
  var logger;
  var github;
  var creds;
  var pack;

  beforeEach(function () {
    logger = {
      log: sinon.spy()
    };

    github = {
      authenticate: sinon.spy(),
      issues: {
        create: function (options, cb) {
          cb({
            data: {
              html_url: 'http://example.com'
            }
          });
        },
        createMilestone: function (options, cb) {
          cb(1);
        }
      },

    };

    creds = {
      username: 'user',
      password: 'pass',
      repo: 'user/repo'
    };

    issuePack = new IssuePack({
      github: github,
      creds: creds
    }, logger);

    pack = {
        'milestone': 'Milestone 1',
        'issues': [
          {
            'title': 'Issue 1',
            'body': 'This is the first issue',
            'tags': [
              'Role 1',
              'Role 2'
            ]
          },
          {
            'title': 'Issue 2',
            'body': 'This is the second issue',
            'tags': [
              'Role 3'
            ]
          },
          {
            'title': 'Issue 3',
            'body': 'This is the third issue'
          }
        ]
      };

    sinon.spy(github.issues, 'createMilestone');
    sinon.spy(github.issues, 'create');
    sinon.spy(issuePack, '_createIssue');
  });

  describe('#load', function () {

    it('should log milestone name to the console', function () {
      issuePack.load(pack);

      expect(logger.log).to.have.been.calledOnce;
      expect(logger.log.calledWith(chalk.yellow('Unpacking milestone: Milestone 1'))).to.be.true;
    });

    it('should contain the correct milestone title and issue count', function () {
      issuePack.load(pack);

      expect(issuePack.pack.milestone).to.equal('Milestone 1');
      expect(issuePack.pack.issues.length).to.equal(3);
    });
  });

  describe('#authenticate', function () {
    it('should log authenticating message', function () {
      issuePack.authenticate();

      expect(logger.log).to.have.been.calledOnce;
      expect(logger.log.calledWith(chalk.yellow('Authenticating with Github'))).to.be.true;
    })
  });

  describe('#push', function () {
    it('should throw an error if no pack is loaded', function () {
      expect(issuePack.push.bind(issuePack, 'push')).to.throw('Cannot push to Github.  Pack contents not loaded.');
    });

    it('should send the correct milestone to Github', function () {
      issuePack.load(pack);
      issuePack.push();

      expect(github.issues.createMilestone.calledOnce).to.be.true;
      expect(github.issues.createMilestone.calledWith('Milestone 1'));
    });

    it('should send the correct number of issues to Github', function () {
      issuePack._createIssues(pack.issues, creds.repo, 1);

      expect(github.issues.create.callCount).to.equal(3);
    });
    it('should send the correct labels with an issue');
  });
});
