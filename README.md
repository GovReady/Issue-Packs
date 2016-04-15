# Issue-Packs
* * *

[![Build Status](https://travis-ci.org/cmbirk/issue-pack.svg?branch=master)](https://travis-ci.org/cmbirk/issue-pack)  [![Coverage Status](https://coveralls.io/repos/github/cmbirk/issue-pack/badge.svg?branch=master)](https://coveralls.io/github/cmbirk/issue-pack?branch=master)

Generate packs of GitHub issues from YAML files

## Installation

Requirements:

* NodeJS >= 1.0

Run `npm install -g issue-pack` to install globally

## Usage

`issue-pack -u username -p password -r repo pack1.yml [pack2.yml] [pack3.yml] ...`

## Examples

Example issue packs can be found in the `examples/` directory.

### Issue Pack Format ( YAML )

```

milestone: <milestone name> # Required
issues: # Required
  -
    title: <issue title> # Required
    body: <issue body text> # Required
    tags: # Optional
      - <tag 1>
      - <tag 2>
  -
    title: <issue title>
    body: <issue body text>
    tags:
      - <tag 1>
      - <tag 2>
  ...

```

## Development

Install npm dependencies:

`npm install`

Link module

`npm link`

Compile ES2015 using Babel

`npm run compile` or use `npm run watch` to watch `src` folder

## Tests

Ensure dependencies are installed with `npm install`

Run `npm test` to run the test suite
Run `npm run coverage` to run istanbul test coverage
