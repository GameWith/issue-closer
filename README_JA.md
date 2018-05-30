# issue-closer

> Close GitHub Issues client for Node.js

[![CircleCI](https://circleci.com/gh/GameWith/issue-closer.svg?style=svg&circle-token=b21021b2a1e74a5292bd7cebbe22aa5b0bf8198e)](https://circleci.com/gh/GameWith/issue-closer)
![Support Node.js version](https://img.shields.io/badge/Node.js%20-8.x-green.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 使用方法

### インストール

```
$ npm i @gamewith/issue-closer --save
```

### クライアント

タスクオプションは [こちら](#タスクオプション) を参照してください。

```js
const Closer = require('@gamewith/issue-closer');

// GitHub のトークンを記述
// @see https://github.com/settings/tokens
const token = 'xxx';

const closer = new Closer(token, {
  // リポジトリのオーナーを指定
  owner: 'xxx',
  // 実行対象のリポジトリを指定
  repository: 'xxx'
});

// タスクの追加
closer.add('sample', {
  filter: (issue) => issue.number === 1,
  query: {
    labels: 'done'
  },
  sleep: 100
});

// 実行
closer.run('sample').then((closedIssues) => {
  console.info(closedIssues);
}).catch((err) => {
  console.error(err);
});
```

### コマンドライン

1. コンフィグファイルの作成

   ```
   $ node_modules/.bin/icloser init
   // created ./.icloser.js
   ```
   
   コンフィグファイルのパス変更は以下のコマンドで行えます。
   
   ```
   $ node_modules/.bin/icloser init --path=/path/to
   // created /path/to/.icloser.js
   ```
2. 実行

   デフォルトタスクは全ての `Issue` を閉じます。

   ```
   $ node_modules/.bin/icloser
   ```

   タスクの指定

   ```
   $ node_modules/.bin/icloser --task=sample
   ```

   コンフィグファイルの参照先を変更

   ```
   $ node_modules/.bin/icloser --configPath=/path/to/.icloser.js
   ```

#### コンフィグ

/path/to/.icloser.js

タスクオプションは [こちら](#タスクオプション) を参照してください。

```js
'use strict';

module.exports = {
  // GitHub のトークンを記述
  // @see https://github.com/settings/tokens
  token: 'xxx',
  config: {
    // リポジトリのオーナーを指定
    owner: 'xxx',
    // 実行対象のリポジトリを指定
    repository: 'xxx'
  },
  // タスクの定義
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

デフォルトタスクを上書きする場合

```js
'use strict';

module.exports = {
  // GitHub のトークンを記述
  // @see https://github.com/settings/tokens
  token: 'xxx',
  config: {
    // リポジトリのオーナーを指定
    owner: 'xxx',
    // 実行対象のリポジトリを指定
    repository: 'xxx'
  },
  // タスクの定義
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

#### タスクオプション

```js
{
  // ロジックで Issue のフィルターを定義できます。
  // undefined の場合は、フィルターを行いません。
  // @type function(issue): bool or undefined
  // @see https://developer.github.com/v3/issues/#list-issues-for-a-repository
  filter: (issue) => issue.number === 1,
  
  // GitHub API の Query で Issue をフィルターします。
  // undefined の場合は、全ての Issue を取得します。
  // @type Object or undefined
  // @see https://developer.github.com/v3/issues/#list-issues-for-a-repository
  query: {
    labels: 'done'
  },
  
  // 20件毎に sleep を実行します。
  // 大量に Issue を閉じると GitHub API のリミット制限対象になるのを避けるために定義します。
  // undefined の場合は sleep しません。
  // @type Number or undefined
  // @see https://developer.github.com/v3/#rate-limiting
  sleep: 10 // msec
}
```

## LICENSE

[MIT](LICENSE)