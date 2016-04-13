# Issue-Packs
* * *

Generate packs of compliance related issues for GitHub issues

## Installation

Requirements:

* NodeJS >= 1.0

Run `npm install -g issue-pack` to install globally

## Usage

`issue-pack -u username -p password -r repo pack1.yml [pack2.yml] [pack3.yml] ...`

## Examples

Example issue packs can be found in the `examples/` directory.

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
