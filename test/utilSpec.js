var expect = require('chai').expect;
var chalk = require('chalk');
var mock = require('mock-fs');
var sinon = require('sinon');
var Util = require('../lib/Util').default;

describe('Util', function () {
  var util;

  before(function () {
    logger = {
      log: sinon.spy()
    };

    util = new Util(logger);
  });

  describe('#parseFiles', function () {
    before(function () {
      mock({
        'pack1.yml': 'Contents 1',
        'pack2.yml': 'Contents 2',
        'pack3.yml': 'Contents 3',
        'examples': {
          'pack4.yml': 'Contents 4',
          'pack5.yml': 'Contents 5',
          'pack6.yml': 'Contents 6'
        }
      });
    });

    after(function () {
      mock.restore();
    });

    it('should throw an error if a single input file does not exist', function () {
      var files = ['missing.yml'];

      expect(function () {
        util.parseFiles(files);
      }).to.throw('File `missing.yml` does not exist.');
    });

    it('should throw an error if any file does not exist', function () {
      var files = ['pack1.yml', 'missing.yml'];

      expect(function () {
        util.parseFiles(files);
      }).to.throw('File `missing.yml` does not exist.');
    });

    it('should correctly parse a single file', function () {
      var files = ['pack1.yml'];
      var result = util.parseFiles(files);

      expect(result).to.equal(files);
    });

    it('should correctly parse an array of files', function () {
      var files = ['pack1.yml', 'pack2.yml', 'pack3.yml'];
      var result = util.parseFiles(files);

      expect(result).to.equal(files);
    });

    it('should correctly parse a directory', function () {
      var files = ['examples'];
      var expected = ['examples/pack4.yml', 'examples/pack5.yml', 'examples/pack6.yml']
      var result = util.parseFiles(files);

      expect(result).to.eql(expected);
    });
  });

  describe('#validate()', function () {
    it('should accept correctly submitted args with one pack', function () {
      var args = {
        u: 'username',
        p: 'password',
        r: 'repo',
        _: 'pack1.yml'
      };

      var results = util.validate(args);

      expect(results).to.be.true;
    });

    it('should accept correctly submitted args with multiple packs', function () {
      var args = {
        u: 'username',
        p: 'password',
        r: 'repo',
        _: ['pack1.yml', 'pack2.yml']
      };

      var results = util.validate(args);

      expect(results).to.be.true;
    });

    it('should reject args without a username', function () {
      var args = {
        p: 'password',
        r: 'repo',
        _: ['pack1.yml', 'pack2.yml']
      };

      var results = util.validate(args);

      expect(results).to.be.false;
    });

    it('should reject args without a password', function () {
      var args = {
        u: 'username',
        r: 'repo',
        _: ['pack1.yml', 'pack2.yml']
      };

      var results = util.validate(args);

      expect(results).to.be.false;
    });

    it('should reject args without a repo', function () {
      var args = {
        u: 'username',
        p: 'password',
        _: ['pack1.yml', 'pack2.yml']
      };

      var results = util.validate(args);

      expect(results).to.be.false;
    });

    it('should reject args without any input packs', function () {
      var args = {
        u: 'username',
        p: 'password',
        r: 'repo',
        _: []
      };

      var results = util.validate(args);

      expect(results).to.be.false;
    });
  });

  describe('#usage', function () {
    it('should return usage message', function () {
      var message = "usage: issue-pack -u username -p password -r repo pack1.yml [pack2.yml] [pack3.yml] ...";

      var results = util.usage();
      expect(results).to.equal(message);
    })
  });
});
