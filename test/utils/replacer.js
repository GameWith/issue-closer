'use strict';

module.exports = (td) => {
  return {
    closer: {
      default: (closer, issues) => {
        td.replace(closer, '_recursiveRequest');
        closer._recursiveRequest = async () => Promise.resolve(issues);
        td.replace(closer, '_update');
        closer._update = async (issues) => Promise.resolve(issues);
      },
      custom: (closer, task, issues) => {
        td.replace(closer, '_recursiveRequest');
        td.when(closer._recursiveRequest(task)).thenResolve(issues);
        td.replace(closer, '_update');
        closer._update = async (issues) => Promise.resolve(issues);
      }
    }
  }
};
