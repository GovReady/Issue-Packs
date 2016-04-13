"use strict";

import chalk from 'chalk';
import fs from 'fs';

export default class Util {
  constructor (logger = console) {
    this.logger = logger;
  }

  parseFiles(files) {
    this._checkExist(files);

    if(files.length === 1) {
      if(fs.lstatSync(files[0]).isDirectory()) {
        var dir = files[0];

        if('/' !== dir.slice(-1)){
          dir = dir + '/';
        }

        this.logger.log(chalk.yellow('Retrieving files from ' + dir));
      }
    }

    return files;
  }

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

  usage() {
    var message = "usage: issue-pack -u username -p password -r repo pack1.yml [pack2.yml] [pack3.yml] ...";

    return message;
  }

  _checkExist(files) {
    for ( var file of files ) {
      if(!fs.existsSync(file)) {
        throw new Error('File `' + file + '` does not exist.');
      }
    }

    return true;
  }
}
