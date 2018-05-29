'use strict';

module.exports = {
  token: '',
  config: {
    owner: '',
    repository: ''
  },
  tasks: {
    sample: {
      filter: (issue) => {
        console.log(issue);
      },
      query: {
        labels: 'done'
      }
    }
  }
};
