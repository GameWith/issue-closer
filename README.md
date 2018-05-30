# issue-closer

> Close GitHub Issue client for Node.js


[![CircleCI](https://circleci.com/gh/GameWith/issue-closer/tree/master.svg?style=svg)](https://circleci.com/gh/GameWith/issue-closer/tree/master)

## Usage

### Install

```
$ npm i issue-closer --save
```

### Client

See [TaskOption](#taskoption)

```js
const Closer = require('issue-closer');

//GitHub TOKEN
//@see https://github.com/settings/tokens
const token = 'xxx';

const closer = new Closer(token, {
  //Repository owner
  owner: 'xxx',
  //Target repository
  repository: 'xxx'
});

// Add task
closer.add('sample', {
  filter: (issue) => issue.number === 1,
  query: {
    labels: 'done'
  },
  sleep: 100
});

// Run close issues
closer.run('sample').then((closedIssues) => {
  console.info(closedIssues);
}).catch((err) => {
  console.error(err);
});
```

### CLI

1. Create config file

   ```
   $ node_modules/.bin/icloser init
   // created ./.icloser.js
   ```
   
   Change destination path
   
   ```
   $ node_modules/.bin/icloser init --path=/path/to
   // created /path/to/.icloser.js
   ```
2. Run close issues

   ```
   $ node_modules/.bin/icloser
   ```

   Specifiy a task.

   ```
   $ node_modules/.bin/icloser --task=sample
   ```

   Change the reference destination of config file.

   ```
   $ node_modules/.bin/icloser --configPath=/path/to/.icloser.js
   ```

#### Config

/path/to/.icloser.js

See [TaskOption](#taskoption)
```js
'use strict';

module.exports = {
  //GitHub TOKEN
  //@see https://github.com/settings/tokens
  token: 'xxx',
  config: {
    //Repository owner
    owner: 'xxx',
    //Target respository
    repository: 'xxx'
  },
  tasks: {
    sample: {
      filter: (issue) => issue.number === 1,
      query: {
        labels: 'done'
      }
    }
  }
};
```

Overwrite default

```js
'use strict';

module.exports = {
  //GitHub TOKEN
  //@see https://github.com/settings/tokens
  token: 'xxx',
  config: {
    //Repository owner
    owner: 'xxx',
    //Target repository
    repository: 'xxx'
  },
  tasks: {
    default: {
      filter: (issue) => issue.number === 1,
      query: {
        labels: 'done'
      }
    },
    sample: {
      filter: (issue) => issue.number === 2
    }
  }
};
```

#### TaskOption

```js
{
  //Filter issue with logic.
  //When undefined, it does not filter issue.
  //@type function(issue): bool or undefined
  //@see https://developer.github.com/v3/issues/#list-issues-for-a-repository
  filter: (issue) => issue.number === 1,
  //Filter by query of GitHub API.
  //When undefined, it get all issues.
  //@type Object or undefined
  //@see https://developer.github.com/v3/issues/#list-issues-for-a-repository
  query: {
    labels: 'done'
  },
  //Sleep every 20 issues.
  //When close a large number of issues, it use to avoid Limit of GitHubAPI.
  //When undefined it does not sleep.
  //@type Number or undefined
  //@see https://developer.github.com/v3/#rate-limiting
  sleep: 10 //msec
}
```

## LICENSE

[MIT](LICENSE)