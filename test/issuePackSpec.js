var expect = require('chai').expect;
var chalk = require('chalk');
var sinon = require('sinon');
var IssuePack = require('../lib/IssuePack').default;

require('mocha-sinon');

describe("IssuePack", function () {
  beforeEach(function () {
    logger = {
      log: sinon.spy()
    };

    issuePack = new IssuePack({}, logger);
  });

  afterEach(function () {
    issuePack = null;
  });

  describe('#load', function () {
    beforeEach(function () {
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
    });

    it('should log milestone name to the console', function () {
      issuePack.load(pack);

      expect(logger.log).to.have.been.calledOnce;
      expect(logger.log.calledWith(chalk.yellow('Unpacking milestone: Milestone 1'))).to.be.true;
    });

    it('should contain the correct pack information', function () {
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
    it('should log authenticating message', function () {
      issuePack.push();

      expect(logger.log).to.have.been.calledOnce;
      expect(logger.log.calledWith(chalk.yellow('Pushing milestone to Github'))).to.be.true;
    })
  });
});
