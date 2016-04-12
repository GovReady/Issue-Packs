var expect = require('chai').expect;
var utils = require('../lib/utils');

describe('Utils', function () {
  describe('#checkEnv()', function () {
    it('should accept a correctly formatted env', function () {
      var env = {
        PACK_USER: 'username',
        PACK_PASS: 'password',
        PACK_REPO: 'repo'
      };

      var results = utils.checkEnv(env);

      expect(results).to.be.true;
    });

    it('should reject a partially complete env', function () {
      var env = {
        PACK_USER: 'username',
        PACK_PASS: 'password',
      };

      var results = utils.checkEnv(env);

      expect(results).to.be.false;
    });

    it('should reject an empty env', function () {
      var env = {};
      var results = utils.checkEnv(env);

      expect(results).to.be.false;
    });
  });
});
