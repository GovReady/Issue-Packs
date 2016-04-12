#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var chalk = require('chalk');
var Github = require('github');
var YAML = require('yamljs');

console.dir(argv);
