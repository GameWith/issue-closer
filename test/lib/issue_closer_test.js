'use strict';

/* eslint-env mocha */
/* eslint-disable max-nested-callbacks */

const td = require('testdouble');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = require('chai').expect;
const Resolver = require('../utils/resolver');
const IssueCloser = require('../../lib/issue_closer');
const Replacer = require('../utils/replacer')(td);

describe('IssueCloser', () => {
  afterEach(() => {
    td.reset();
  });
  describe('#constructor', () => {
    describe('with empty args', () => {
      it('should return error', () => {
        expect(() => new IssueCloser()).to.throw();
      });
    });
    describe('with options is undefined', () => {
      it('should return error', () => {
        expect(() => new IssueCloser('xxx')).to.throw();
      });
    });
    describe('with options is invalid type', () => {
      it('should return error', () => {
        expect(() => new IssueCloser('xxx', 1)).to.throw();
      });
    });
    describe('with token is invalid type', () => {
      it('should return error', () => {
        expect(() => new IssueCloser({dummy: 'x'}, {
          owner: 'xxx',
          repository: 'xxx'
        })).to.throw();
      });
    });
    describe('with valid args', () => {
      it('should return issue closer', () => {
        expect(() => new IssueCloser('xxx', {
          owner: 'xxx',
          repository: 'xxx'
        })).to.not.throw();
      });
    });
  });
  describe('#run', () => {
    describe('with empty args', () => {
      it('should return 6 issues', async () => {
        const task = {};
        const issues = Resolver.fixture('issues').data;
        const closer = new IssueCloser('xxx', {repository: 'x', owner: 'x'});
        Replacer.closer.custom(closer, task, issues);
        const results = await closer.run(task);
        expect(results.length).to.eql(6);
      });
    });
    describe('with filter', () => {
      it('should return 1 issues', async () => {
        const task = {filter: (issue) => issue.number === -3};
        const issues = Resolver.fixture('issues').data;
        const closer = new IssueCloser('xxx', {repository: 'x', owner: 'x'});
        Replacer.closer.custom(closer, task, issues);
        const results = await closer.run(task);
        expect(results.length).to.eql(1);
      });
      it('should return empty issues', async () => {
        const task = {filter: (issue) => issue.reactions['+1'] > 0};
        const issues = Resolver.fixture('issues').data;
        const closer = new IssueCloser('xxx', {repository: 'x', owner: 'x'});
        Replacer.closer.custom(closer, task, issues);
        const results = await closer.run(task);
        expect(results.length).to.eql(0);
      });
    });
    describe('with sleep', () => {
      it('should return true', async () => {
        const task = {sleep: 50};
        const issues = Resolver.fixture('issues').data;
        const closer = new IssueCloser('xxx', {repository: 'x', owner: 'x'});
        Replacer.closer.custom(closer, task, issues);
        const start = new Date().getTime();
        await closer.run(task);
        const finish = new Date().getTime();
        expect((finish - start) >= task.sleep).eql(true);
      });
    });
  });
  describe('#_buildQuery', () => {
    describe('when arg is valid', () => {
      it('should has required parameters and arg parameter', () => {
        const closer = new IssueCloser('xxx', {repository: 'x', owner: 'x'});
        const query = closer._buildQuery({state: 'done'});
        expect(query.owner).to.eql('x');
        expect(query.repo).to.eql('x');
        expect(query.page).to.eql(1);
        expect(query.per_page).to.eql(100);
        expect(query.state).to.eql('done');
      });
    });
    describe('when arg is invalid', () => {
      it('should has required parameters', () => {
        const closer = new IssueCloser('xxx', {repository: 'x', owner: 'x'});
        expect(() => closer._buildQuery(-1)).to.throw();
      });
    });
    describe('when arg is empty', () => {
      it('should has owner and repo', () => {
        const closer = new IssueCloser('xxx', {repository: 'x', owner: 'x'});
        const query = closer._buildQuery();
        expect(query.owner).to.eql('x');
        expect(query.repo).to.eql('x');
        expect(query.page).to.eql(1);
        expect(query.per_page).to.eql(100);
        expect(query.state).to.not.eql('done');
      });
    });
  });
});
