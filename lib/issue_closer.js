'use strict';

const _ = require('lodash');
const octokit = require('./octokit');
const sleep = require('./sleep');

const PAGE = 1;
const PER_PAGE = 100;
const CHUNK_SIZE = 20;

class IssueCloser {
  /**
   * Constructor
   * @param {String} token GitHub token
   * @param {Object} config GitHub config
   */
  constructor(token, config) {
    this._setConfig(config);
    this._octokit = octokit(token);
  }

  /**
   * Run close issues task
   * @param {Object|undefined} task task settings
   * @param {(function(Object): boolean)|undefined} task.filter filter issue
   * @param {Object|undefined} task.query filter api query
   * @param {Number|undefined} task.sleep sleep send api
   * @return {Promise<Array>}
   */
  async run(task) {
    task = task || {};
    const issues = await this._recursiveRequest(task);
    const chunkIssues = _.chunk(issues, CHUNK_SIZE);
    let results = [];
    for (let _issues of chunkIssues) {
      if (task.filter) {
        _issues = _issues.filter(task.filter);
      }
      results = results.concat(await this._update(_issues));
      if (task.sleep) {
        await sleep(task.sleep);
      }
    }
    return results;
  }

  /**
   * Get Issues recursively
   * @param {Object} task task settings
   * @param {(function(Object): boolean)|undefined} task.filter filter issue
   * @param {Object|undefined} task.query filter api query
   * @param {Number|undefined} task.sleep sleep send api
   * @return {Promise<void>}
   * @private
   */
  async _recursiveRequest(task) {
    const query = this._buildQuery(task.query);
    let response = await this._octokit.issues.getForRepo(query);
    let issues = response.data;
    while (this._octokit.hasNextPage(response)) {
      response = await this._octokit.getNextPage(response);
      issues = issues.concat(response.data);
    }
    return issues;
  }

  /**
   * Close issues
   * @param {Array<Object>} issues GitHub issues(response.data)
   * @return {Promise<void>}
   * @private
   */
  _update(issues) {
    const promises = issues.map((issue) => {
      return this._octokit.issues.edit(this._buildQuery({
        number: issue.number,
        state: 'closed'
      }));
    });
    return Promise.all(promises);
  }

  /**
   * Set config
   * @param {Object} config
   * @private
   */
  _setConfig(config) {
    if (!_.isPlainObject(config)) {
      throw new TypeError('config is invalid type');
    }
    this._config = Object.assign({}, {
      owner: config.owner,
      repo: config.repository,
      page: PAGE,
      per_page: PER_PAGE
    });
  }

  /**
   * Build Query
   * @param {Object} query
   * @return {Object}
   * @private
   */
  _buildQuery(query) {
    if (_.isUndefined(query)) {
      return this._config;
    }
    if (_.isPlainObject(query)) {
      return Object.assign({}, query, this._config);
    }
    throw new TypeError('query is invalid type');
  }
}

module.exports = IssueCloser;
