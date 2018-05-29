'use strict';

const _ = require('lodash');
const Octokit = require('@octokit/rest');

/**
 * Get Github authenticated instance
 * @param {String} token GitHub token
 * @return {octokit}
 */
module.exports = (token) => {
  if (_.isEmpty(token) || !_.isString(token)) {
    throw new TypeError('token is empty or invalid type');
  }

  const octokit = new Octokit();

  octokit.authenticate({
    type: 'token',
    token
  });

  return octokit;
};
