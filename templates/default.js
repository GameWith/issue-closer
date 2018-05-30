'use strict';

module.exports = {
  token: '',
  config: {
    owner: '',
    repository: ''
  },
  tasks: {
    sample: {
      filter: (issue) => issue.title === 'sample',
      query: {
        labels: 'done'
      }
    }
  }
};
