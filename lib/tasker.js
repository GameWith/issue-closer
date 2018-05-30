'use strict';

const _ = require('lodash');
const IssueCloser = require('./issue_closer');

class Tasker {
  /**
   * Constructor
   * @param {String} token GitHub token
   * @param {Object} config GitHub config
   */
  constructor(token, config) {
    this._tasks = {};
    this._closer = new IssueCloser(token, config);
    this.add('default');
  }

  /**
   * Add task
   * @param {String} taskName task name
   * @param {Object|undefined} task task settings
   * @param {(function(Object): boolean)|undefined} task.filter filter issue
   * @param {Object|undefined} task.query filter api query
   * @param {Number|undefined} task.sleep sleep send api
   * @return {void}
   */
  add(taskName, task) {
    if (_.isEmpty(taskName) || !_.isString(taskName)) {
      throw new TypeError('taskName is empty or invalid type');
    }
    if (_.isUndefined(task)) {
      this._tasks[taskName] = undefined;
      return;
    }
    if (_.isPlainObject(task)) {
      this._tasks[taskName] = task;
      return;
    }
    throw new TypeError('task is invalid type');
  }

  /**
   * Run task
   * @param {String|undefined} taskName task name
   * @return {Promise<void>}
   */
  async run(taskName) {
    taskName = taskName || 'default';
    if (this._tasks.hasOwnProperty(taskName) === false) {
      throw new Error(`task:[${taskName}] is not found`);
    }
    const task = this._tasks[taskName];
    const closedIssues = await this._closer.run(task);
    return closedIssues;
  }
}

module.exports = Tasker;
