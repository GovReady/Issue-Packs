var expect = require('chai').expect;
var utils = require('../lib/utils');

describe('Utils', function () {
  describe('#validate()', function () {
    it('should accept correctly submitted args with one pack', function () {
      var args = {
        u: 'username',
        p: 'password',
        r: 'repo',
        _: 'pack1.yml'
      };

      var results = utils.validate(args);

      expect(results).to.be.true;
    });

    it('should accept correctly submitted args with multiple packs', function () {
      var args = {
        u: 'username',
        p: 'password',
        r: 'repo',
        _: ['pack1.yml', 'pack2.yml']
      };

      var results = utils.validate(args);

      expect(results).to.be.true;
    });

    it('should reject args without a username', function () {
      var args = {
        p: 'password',
        r: 'repo',
        _: ['pack1.yml', 'pack2.yml']
      };

      var results = utils.validate(args);

      expect(results).to.be.false;
    });

    it('should reject args without a password', function () {
      var args = {
        u: 'username',
        r: 'repo',
        _: ['pack1.yml', 'pack2.yml']
      };

      var results = utils.validate(args);

      expect(results).to.be.false;
    });

    it('should reject args without a repo', function () {
      var args = {
        u: 'username',
        p: 'password',
        _: ['pack1.yml', 'pack2.yml']
      };

      var results = utils.validate(args);

      expect(results).to.be.false;
    });

    it('should reject args without any input packs', function () {
      var args = {
        u: 'username',
        p: 'password',
        r: 'repo',
        _: []
      };

      var results = utils.validate(args);

      expect(results).to.be.false;
    });
  });

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

  describe('#usage', function () {
    it('should return usage message', function () {
      var message = "usage: issue-pack -u username -p password -r repo pack1.yml pack2.yml ...";

      var results = utils.usage();
      expect(results).to.equal(message);
    })
  });
});
