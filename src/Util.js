"use strict";

import chalk from 'chalk';
import fs from 'fs';

export default class Util {
  //Set util options
  constructor (logger = console) {
    this.logger = logger;
  }

  promptSchema() {
    return {
      properties: {
        tool: {
          required: true
        }
      }
    };
  }

  // List of files separated by white space
  parseFiles(stringListOfFiles) {

    if (!stringListOfFiles) {
      stringListOfFiles = '';
    }

    var files = stringListOfFiles.split(' ');

    //Ensure that the input files or directory exist
    this._checkExist(files);

    //If there's only one input
    if(files.length === 1) {
      //Check if it's a directory and parse directory,
        //Otherwise just return the files array
      if(fs.lstatSync(files[0]).isDirectory()) {
        var dir = files[0];

        var dirFiles = fs.readdirSync(dir);

        if('/' !== dir.slice(-1)){
          dir = dir + '/';
        }

        this.logger.log(chalk.yellow('Retrieved files from `' + dir + '`'));

        var paths = dirFiles.map(function (file) {
          var path = dir + file;

          return path;
        });

        return paths;
      }
    }

    return files;
  }

  parse(args) {
    var options = {};
    var util = this;
    args.forEach(function (arg) {
      if (util.startsWith(arg, "-t=")) {
        options.tool = arg.split('=', 2)[1];
      }
    });
    return options;
  }

  startsWith(str, prefix) {
    return str.substr(0, prefix.length) == prefix;
  }

  //Validate input arguments
  validate(args) {
    var error = false;

    var tool = args.tool;

    if (tool === undefined || tool === true) {
      error = true;
    }

    return !error;
  }

  //Print script usage
  usage() {
    var message = "usage: issue-pack -t=[toolName]";

    return message;
  }

  //Check input files or directory exist
  _checkExist(files) {
    for ( var file of files ) {
      if(!fs.existsSync(file)) {
        throw new Error('File `' + file + '` does not exist.');
      }
    }

    return true;
  }
}
