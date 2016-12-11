# Issue-Packs
* * *

[![Build Status](https://travis-ci.org/GovReady/Issue-Packs.svg?branch=master)](https://travis-ci.org/GovReady/Issue-Packs)  [![Coverage Status](https://coveralls.io/repos/github/GovReady/Issue-Packs/badge.svg?branch=master)](https://coveralls.io/github/GovReady/Issue-Packs?branch=master)

Generate packs of GitHub issues from YAML files

## Installation

Requirements:

* NodeJS >= 1.1

Run `npm install -g issue-pack` to install globally

## Usage

`issue-pack`

  * _tool_: Jira or Github (defaults to Github)
  * _username_: Jira/Github Username
  * _password_: Jira/Github Password
  * _path_: this can be a single issue pack YAML file or a directory containing issue pack YAML files
  * **(Jira)** _projectKey_: Project key of Jira project to import issues to. This is the 1-4 character prefix that prefixes all issues in the project
  * **(Jira)** _jiraBaseUri_: Base URI (_eg. https://jira.govready.com or https://govready.atlassian.net_)
  * **(Github)** _repo_: Github Repos take the form `user/repo` (_eg. GovReady/Issue-Packs_)

### Issue Pack Format ( YAML )

```

name: <pack name> # Required
issues: # Required
  -
    title: <issue title> # Required
    body: <issue body text> # Required
    labels: # Optional
      - <tag 1>
      - <tag 2>
  -
    title: <issue title>
    body: <issue body text>
    labels:
      - <tag 1>
      - <tag 2>
  ...

```

### Jira Integration Information

Currently, Issue Pack defaults all issues to issue type "Task" to support all three software development project types: Basic, Kanban, and Scrum.

For this first iteration, basic authentication is used and is recommended to only connect to secure Jira instances.

## Development

_If you would like to contribute, you will need to be able to compile and run the issue-pack npm module locally_

The contribution guidelines are included below, but [this blog post](http://javascriptplayground.com/blog/2015/03/node-command-line-tool/) is a good starter on the subject.

Please refer to the contribution guidelines below for development build and testing processes.

**Contribution Guidelines**

The contribution guidelines for this repository can be found [in CONTRIBUTING.md](https://github.com/GovReady/Issue-Packs/blob/master/CONTRIBUTING.md).
