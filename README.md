# issue-closer

> Close GitHub Issue client for Node.js

---

[![CircleCI](https://circleci.com/gh/GameWith/issue-closer/tree/master.svg?style=svg)](https://circleci.com/gh/GameWith/issue-closer/tree/master)

## Usage

### Install

```
$ npm i issue-closer --save
```

### Client

```js
const Closer = require('issue-closer');
// GitHub TOKEN
//@see https://github.com/settings/tokens
const token = 'xxx';
const closer = new Closer(token, {
  // Repository owner
  owner: 'xxx',
  // Target repository
  repository: 'xxx'
});

// Add task
closer.add('sample', {
  // Logic filter
  //@see https://developer.github.com/v3/issues/#list-issues-for-a-repository
  filter: (issue) => issue.number === 1,
  // Api filter
  //@see https://developer.github.com/v3/issues/#list-issues-for-a-repository
  query: {
    labels: 'done'
  },
  // Sleep (msec)
  // Every 20 issues.
  sleep: 100
});

// Run close issue
closer.run('sample').then((closedIssues) => {
  console.info(closedIssues);
}).catch((err) => {
  console.error(err);
});
```

### CLI

#### Init

Default
```
$ node_modules/.bin/icloser init
// created ./.icloser.js
```

Option
```
$ node_modules/.bin/icloser init --path=/path/to
// created /path/to/.icloser.js
```

### Options

