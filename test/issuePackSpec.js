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
    it('should log milestone name to the console', function () {
      var pack = {
        'milestone': 'Milestone 1'
      };

      issuePack.load(pack);

      expect(logger.log).to.have.been.calledOnce;
      expect(logger.log.calledWith(chalk.green('Unpacking milestone: Milestone 1'))).to.be.true;
    });
  });

  describe('#authenticate', function () {
    it('should log authenticating message', function () {
      issuePack.authenticate();

      expect(logger.log).to.have.been.calledOnce;
      expect(logger.log.calledWith(chalk.green('Authenticating with Github'))).to.be.true;
    })
  });

  describe('#push', function () {
    it('should log authenticating message', function () {
      issuePack.push();

      expect(logger.log).to.have.been.calledOnce;
      expect(logger.log.calledWith(chalk.green('Pushing milestone to Github'))).to.be.true;
    })
  });
});
