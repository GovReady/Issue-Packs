var expect = require('chai').expect;
var chalk = require('chalk');
var sinon = require('sinon');
var IssuePack = require('../lib/IssuePack').default;

require('mocha-sinon');

describe("IssuePack", function () {
  describe('#load', function () {
    it('should log milestone name to the console', function () {
      var logger = {
        log: sinon.spy()
      };

      var pack = {
        'milestone': 'Milestone 1'
      };
      var issuePack = new IssuePack({}, logger);

      issuePack.load(pack);

      expect(logger.log).to.have.been.calledOnce;
      expect(logger.log.calledWith(chalk.green('Unpacking milestone: Milestone 1'))).to.be.true;
    });
  })
});
