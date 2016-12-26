var expect = require('chai').expect;
var chalk = require('chalk');
var mock = require('mock-fs');
var sinon = require('sinon');
var Util = require('../lib/Util').default;
var JiraUtil = require('../lib/JiraUtil').default;

describe('JiraUtil', function () {
  var util, jiraUtil;

  before(function () {
    logger = {
      log: sinon.spy()
    };

    util = new Util(logger);
    jiraUtil = new JiraUtil(util, logger);
  });

  describe('#promptSchema()', function () {
    it('should return a non-null object', function () {

      var promptSchema = jiraUtil.promptSchema();

      expect(promptSchema !== undefined).to.be.true;
      expect(promptSchema !== null).to.be.true;
      expect(typeof promptSchema === 'object').to.be.true;
    });
  });

  describe('#parse()', function () {

    it('should returned a parsed tool', function () {
      var testArgs = ['-t=jira'];
      var parsedArgs = jiraUtil.parse(testArgs);
      expect(parsedArgs.tool === 'jira').to.be.true;
    });

    it('should returned a parsed username', function () {
      var testArgs = ['-u=test'];
      var parsedArgs = jiraUtil.parse(testArgs);
      expect(parsedArgs.username === 'test').to.be.true;
    });

    it('should returned a parsed projectKey', function () {
      var testArgs = ['-k=KEY'];

      var parsedArgs = jiraUtil.parse(testArgs);
      expect(parsedArgs.projectKey === 'KEY').to.be.true;
    });

    it('should returned a parsed jiraBaseUri', function () {
      var testArgs = ['-b=https://govready.atlassian.net'];
      var parsedArgs = jiraUtil.parse(testArgs);
      expect(parsedArgs.jiraBaseUri === 'https://govready.atlassian.net').to.be.true;
    });

    it('should returned a path', function () {
      var testArgs = ['examples/example-pack2.yml', 'examples/example-pack.yml'];
      var parsedArgs = jiraUtil.parse(testArgs);
      expect(parsedArgs.path === 'examples/example-pack2.yml examples/example-pack.yml').to.be.true;
    });
  });

  describe('#validate()', function () {
    it('should accept correctly submitted args with one pack', function () {
      var args = {
        tool: 'jira',
        username: 'username',
        password: 'password',
        projectKey: 'key',
        jiraBaseUri: 'https://baseuri',
        path: 'pack1.yml'
      };

      var results = jiraUtil.validate(args);

      expect(results).to.be.true;
    });

    it('should accept correctly submitted args with multiple packs', function () {
      var args = {
        tool: 'jira',
        username: 'username',
        password: 'password',
        projectKey: 'key',
        jiraBaseUri: 'https://baseuri',
        path: 'pack1.yml pack2.yml'
      };

      var results = jiraUtil.validate(args);

      expect(results).to.be.true;
    });

    it('should reject args without a username', function () {
      var args = {
        tool: 'jira',
        password: 'password',
        projectKey: 'key',
        jiraBaseUri: 'https://baseuri',
        path: 'pack1.yml pack2.yml'
      };

      var results = jiraUtil.validate(args);

      expect(results).to.be.false;
    });

    it('should reject args without a password', function () {
      var args = {
        tool: 'jira',
        username: 'username',
        projectKey: 'key',
        jiraBaseUri: 'https://baseuri',
        path: 'pack1.yml pack2.yml'
      };

      var results = jiraUtil.validate(args);

      expect(results).to.be.false;
    });

    it('should reject args without a projectKey', function () {
      var args = {
        tool: 'jira',
        username: 'username',
        password: 'password',
        jiraBaseUri: 'https://baseuri',
        path: 'pack1.yml pack2.yml'
      };

      var results = jiraUtil.validate(args);

      expect(results).to.be.false;
    });

    it('should reject args without a jiraBaseUri', function () {
      var args = {
        tool: 'jira',
        username: 'username',
        password: 'password',
        projectKey: 'key',
        path: 'pack1.yml pack2.yml'
      };

      var results = jiraUtil.validate(args);

      expect(results).to.be.false;
    });

    it('should reject args without any input packs', function () {
      var args = {
        tool: 'jira',
        username: 'username',
        password: 'password',
        projectKey: 'key',
        jiraBaseUri: 'https://baseuri',
        path: ''
      };

      var results = jiraUtil.validate(args);

      expect(results).to.be.false;
    });
  });

  describe('#usage', function () {
    it('should return usage message', function () {
      var message = "usage: issue-pack -t=jira -u=username -p=password -k=projectKey -b=baseUri pack1.yml [pack2.yml] [pack3.yml] ...";

      var results = jiraUtil.usage();
      expect(results).to.equal(message);
    })
  });
});
