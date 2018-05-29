# issue-closer

# 実行方法

## ライブラリ

```
const issueCloser = require('issue-closer');

// @see query: https://octokit.github.io/rest.js/#api-Issues-getForRepo
issueCloser.add('close_by_done_label', {
  query: {labels: 'done'}
});

issueCloser.run('close_by_done_label').then(() => {
  // success
}).catch((err) => {
  // error
});
```

## コマンドライン

```
$ node_modules/.bin/icloser init
// => create .icloser.js
```

```js
module.exports = {
  // github token
  token: 'xxxx',
  config: {
    // github repository owner
    owner: '',
    // github repository
    repository: ''
  },
  tasks: {
    sample: {
      // Logic filter
      // https://developer.github.com/v3/issues/#list-issues-for-a-repository
      filter: (issue) => {
        return issue.title !== 'sample';
      },
      // Api filter
      // https://developer.github.com/v3/issues/#list-issues-for-a-repository
      query: {
        labels: 'sample'
      }
    }
  }
}
```