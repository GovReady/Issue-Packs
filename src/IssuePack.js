"use strict";

import chalk from 'chalk';

export default class IssuePack {
  constructor (options, logger = console) {
    this.options = options;
    this.logger = logger;
  }

  load(pack) {
    this.logger.log(chalk.green('Unpacking milestone: ' + pack.milestone));
  }

  authenticate() {
    this.logger.log(chalk.green('Authenticating with Github'));
  }

  push() {
    this.logger.log(chalk.green('Pushing milestone to Github'));
  }

  toObject() {
    return {
      github: this.options.github,
      creds: this.options.creds,
      pack: this.options.pack
    };
  }
}
