var expect = require('chai').expect;
var chalk = require('chalk');
var mock = require('mock-fs');
var sinon = require('sinon');
var Util = require('../lib/Util').default;
var GithubUtil = require('../lib/GithubUtil').default;

describe('GithubUtil', function () {
  var util, githubUtil;

  before(function () {
    logger = {
      log: sinon.spy()
    };

    util = new Util(logger);
    githubUtil = new GithubUtil(util, logger);
  });

  describe('#promptSchema()', function () {
    it('should return a non-null object', function () {

      var promptSchema = githubUtil.promptSchema();

      expect(promptSchema !== undefined).to.be.true;
      expect(promptSchema !== null).to.be.true;
      expect(typeof promptSchema === 'object').to.be.true;
    });
  });

  describe('#parse()', function () {

    it('should returned a parsed tool', function () {
      var testArgs = ['-t=github'];
      var parsedArgs = githubUtil.parse(testArgs);
      expect(parsedArgs.tool === 'github').to.be.true;
    });

    it('should returned a parsed username', function () {
      var testArgs = ['-u=test'];
      var parsedArgs = githubUtil.parse(testArgs);
      expect(parsedArgs.username === 'test').to.be.true;
    });

    it('should returned a parsed repo', function () {
      var testArgs = ['-r=repo/repo'];

      var parsedArgs = githubUtil.parse(testArgs);
      expect(parsedArgs.repo === 'repo/repo').to.be.true;
    });

    it('should returned a path', function () {
      var testArgs = ['examples/example-pack2.yml', 'examples/example-pack.yml'];
      var parsedArgs = githubUtil.parse(testArgs);
      expect(parsedArgs.path === 'examples/example-pack2.yml examples/example-pack.yml').to.be.true;
    });
  });

  describe('#validate()', function () {
    it('should accept correctly submitted args with one pack', function () {
      var args = {
        tool: 'github',
        username: 'username',
        password: 'password',
        repo: 'repo/repo',
        path: 'pack1.yml'
      };

      var results = githubUtil.validate(args);

      expect(results).to.be.true;
    });

    it('should accept correctly submitted args with multiple packs', function () {
      var args = {
        tool: 'github',
        username: 'username',
        password: 'password',
        repo: 'repo/repo',
        path: 'pack1.yml pack2.yml'
      };

      var results = githubUtil.validate(args);

      expect(results).to.be.true;
    });

    it('should reject args without a username', function () {
      var args = {
        tool: 'github',
        password: 'password',
        repo: 'repo/repo',
        path: 'pack1.yml pack2.yml'
      };

      var results = githubUtil.validate(args);

      expect(results).to.be.false;
    });

    it('should reject args without a password', function () {
      var args = {
        tool: 'github',
        username: 'username',
        repo: 'repo/repo',
        path: 'pack1.yml pack2.yml'
      };

      var results = githubUtil.validate(args);

      expect(results).to.be.false;
    });

    it('should reject args without a repo', function () {
      var args = {
        tool: 'github',
        username: 'username',
        password: 'password',
        path: 'pack1.yml pack2.yml'
      };

      var results = githubUtil.validate(args);

      expect(results).to.be.false;
    });

    it('should reject args without any input packs', function () {
      var args = {
        tool: 'github',
        username: 'username',
        password: 'password',
        repo: 'repo/repo',
        path: ''
      };

      var results = githubUtil.validate(args);

      expect(results).to.be.false;
    });
  });

  describe('#usage', function () {
    it('should return usage message', function () {
      var message = "usage: issue-pack -t=github -u=username -p=password -r=repo pack1.yml [pack2.yml] [pack3.yml] ...";

      var results = githubUtil.usage();
      expect(results).to.equal(message);
    })
  });
});
