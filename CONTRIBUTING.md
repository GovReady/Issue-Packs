#Contributing to Issue Packs

_This package is set up as a NodeJS command line utility.  Each node package is configured through a `package.json` file.  There's quite a bit in there, but I'll cover the relevant pieces below._

**Getting Set Up:**

1.  Fork, then clone the repo
  * `git clone git@github.com:your-username/Issue-Packs.git`
1.  Run `npm run setup`
  * This will run the following setup steps:

    *  Install npm dependencies `npm install`
      * This installs the package's dependencies in the `node_modules` directory.  There are two areas in the `package.json` file that contain these dependencies.
        * `dependencies`: all dependencies necessary for running the utility in production
        * `devDependencies`: all dependencies necessary for developing and contributing to the utility.

    * Link module `npm link`
      * This symlinks files from the package as defined in the `bin` attribute.  The first argument is what the command will be symlinked as in the node commands directory and the second is the file that will be used.
      * This is where the command `issue-pack` is defined.
      * When installing Issue Packs as a global dependency, node automatically uses this attribute to create the symlink.  When we're developing locally however, pulling from git instead of installing via node, we must run the link manually
1.  Ensure the tests pass `npm test`
1.  Make your change, add tests for your change, and ensure the tests pass
  * The source files for this package are in the `src/` directory.  These classes utilize [ES2015](https://babeljs.io/docs/learn-es2015/) and are compiled to the `lib/` directory using `npm run compile`.  The `src/` directory can be watched and autocompiled using `npm run watch`
  * These classes are included and utilized in the `index.js` file.  This file is what is executed when running the utility via command line.
  * The tests can be found in the `test/` directory and utilize [mocha](https://mochajs.org/), [chai](http://chaijs.com/), and [sinon](http://sinonjs.org/).  Here's a good introductory [blog post](https://nicolas.perriault.net/code/2013/testing-frontend-javascript-code-using-mocha-chai-and-sinon/) on the subject.
1.  Push to your fork and [create a pull request](https://help.github.com/articles/creating-a-pull-request/)
1.  After this we will review and accept the pull request or suggest changes.

_Well commented code, clear commit messages, clear pull request messages, and strong test coverage increase the likelihood of your pull request being accepted_
