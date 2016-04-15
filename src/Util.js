"use strict";

import chalk from 'chalk';
import fs from 'fs';

export default class Util {
  //Set util options
  constructor (logger = console) {
    this.logger = logger;
  }

  parseFiles(files) {
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

  //Validate input arguments
  validate(args) {
    var username = args.u;
    var password = args.p;
    var repo = args.r;
    var packs = args._;
    var error = false;

    if (username === undefined || username === true) {
      error = true;
    }

    if (password === undefined || password === true) {
      error = true;
    }

    if (repo === undefined || repo === true) {
      error = true;
    }

    if (packs.length === 0) {
      error = true;
    }

    return !error;
  }

  //Print script usage
  usage() {
    var message = "usage: issue-pack -u username -p password -r repo pack1.yml [pack2.yml] [pack3.yml] ...";

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
