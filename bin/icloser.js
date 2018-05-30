#!/usr/bin/env node
'use strict';

const _ = require('lodash');
const fs = require('fs');
const util = require('util');
const path = require('path');
const prog = require('caporal');
const Tasker = require('../lib/tasker');

/**
 * Validate config
 * @param {Object} icloser
 */
const validate = (icloser) => {
  if (!_.isPlainObject(icloser)) {
    throw new TypeError('Config file is empty');
  }

  if (!icloser.token) {
    throw new TypeError('token is empty');
  }

  if (!_.isPlainObject(icloser.config)) {
    throw new TypeError(`config is empty or invalid type`);
  }

  ['owner', 'repository'].forEach((key) => {
    if (!icloser.config[key]) {
      throw new TypeError(`config.${key} is empty`);
    }
  });

  if (!_.isUndefined(icloser.tasks) && !_.isPlainObject(icloser.tasks)) {
    throw new TypeError('tasks is invalid type');
  }
};

/**
 * Load tasker instance
 * @param {Object} options cli options
 * @return {Promise<Tasker>}
 */
const loadTasker = async (options) => {
  const src = options.configPath || path.join(process.env.PWD, './.icloser.js');
  const icloser = require(src);
  validate(icloser);
  const tasker = new Tasker(icloser.token, icloser.config);
  Object.keys(icloser.tasks)
    .forEach((name) => tasker.add(name, icloser.tasks[name]));
  return tasker;
};

prog
  .version('0.0.1')
  .description('Close GitHub issues.')
  .option('--task <task>', 'execute task from task name', prog.STRING)
  .option('--configPath <script>', 'config path', prog.STRING)
  .action(async (args, options) => {
    try {
      console.info('Start - Close GitHub issues');
      const tasker = await loadTasker(options);
      const closedIssues = await tasker.run(options.task);
      console.info(`Closed Issues count: ${closedIssues.length}`);
      console.info('Finish - Closed GitHub issues');
    } catch (err) {
      console.error(err);
    }
  })
  .command('init', 'Create config file')
  .option('--path <path>', 'Destination path')
  .action(async (args, options) => {
    const dstPath = path.join(options.path || process.env.PWD, './.icloser.js');
    const srcPath = path.join(path.join(__dirname, '/../templates/default.js'));
    const src = await util.promisify(fs.readFile)(srcPath);
    await util.promisify(fs.writeFile)(dstPath, src, {flag: 'wx'});
    console.info(`created config file: ${dstPath}`);
  });

prog.parse(process.argv);
