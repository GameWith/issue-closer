'use strict';

/* eslint-env mocha */
/* eslint-disable max-nested-callbacks */

const td = require('testdouble');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = require('chai').expect;
const Resolver = require('../utils/resolver');
const Tasker = require('../../lib/tasker');
const Replacer = require('../utils/replacer')(td);

describe('Tasker', () => {
  afterEach(() => {
    td.reset();
  });
  describe('#constructor', () => {
    describe('with empty args', () => {
      it('should return error', () => {
        expect(() => new Tasker()).to.throw();
      });
    });
    describe('with options is undefined', () => {
      it('should return error', () => {
        expect(() => new Tasker('xxx')).to.throw();
      });
    });
    describe('with options is invalid type', () => {
      it('should return error', () => {
        expect(() => new Tasker('xxx', 1)).to.throw();
      });
    });
    describe('with token is invalid type', () => {
      it('should return error', () => {
        expect(() => new Tasker({dummy: 'x'}, {
          owner: 'xxx',
          repository: 'xxx'
        })).to.throw();
      });
    });
    describe('with valid args', () => {
      it('should return issue closer', () => {
        expect(() => new Tasker('xxx', {
          owner: 'xxx',
          repository: 'xxx'
        })).to.not.throw();
      });
    });
  });
  describe('#add', () => {
    describe('with args is empty', () => {
      it('should be error', () => {
        const tasker = new Tasker('x', {owner: 'x', repository: 'x'});
        expect(() => tasker.add()).to.throw();
      });
    });
    describe('with taskName is invalid type', () => {
      it('should be error', () => {
        const tasker = new Tasker('x', {owner: 'x', repository: 'x'});
        const task = {filter: () => true, query: {labels: 'ui'}};
        expect(() => tasker.add(-1, task)).to.throw();
      });
      it('should be error', () => {
        const tasker = new Tasker('x', {owner: 'x', repository: 'x'});
        const task = {filter: () => true, query: {labels: 'ui'}};
        expect(() => tasker.add([], task)).to.throw();
      });
      it('should be error', () => {
        const tasker = new Tasker('x', {owner: 'x', repository: 'x'});
        const task = {filter: () => true, query: {labels: 'ui'}};
        expect(() => tasker.add({}, task)).to.throw();
      });
    });
    describe('with task is empty', () => {
      it('should success', () => {
        const tasker = new Tasker('x', {owner: 'x', repository: 'x'});
        expect(() => tasker.add('x')).to.not.throw();
      });
    });
    describe('with task is invalid type', () => {
      it('should be error', () => {
        const tasker = new Tasker('x', {owner: 'x', repository: 'x'});
        expect(() => tasker.add('x', [])).to.throw();
      });
      it('should be error', () => {
        const tasker = new Tasker('x', {owner: 'x', repository: 'x'});
        expect(() => tasker.add('x', -1)).to.throw();
      });
      it('should be error', () => {
        const tasker = new Tasker('x', {owner: 'x', repository: 'x'});
        expect(() => tasker.add('x', () => 0)).to.throw();
      });
    });
    describe('with args is valid', () => {
      it('should be add task', () => {
        const tasker = new Tasker('x', {owner: 'x', repository: 'x'});
        const task = {filter: () => true, query: {labels: 'ui'}};
        tasker.add('x', task);
        expect(tasker._tasks).to.have.property('x', task);
      });
    });
    describe('with overwrite', () => {
      it('should be overwrite', () => {
        const tasker = new Tasker('x', {owner: 'x', repository: 'x'});
        const task = {filter: () => true, query: {labels: 'ui'}};
        tasker.add('x', {});
        tasker.add('x', task);
        expect(tasker._tasks).to.have.property('x', task);
      });
    });
  });
  describe('#run', () => {
    describe('with default task', () => {
      it('should be 6 issues', async () => {
        const tasker = new Tasker('x', {owner: 'x', repository: 'x'});
        const issues = Resolver.fixture('issues').data;
        Replacer.closer.default(tasker._closer, issues);
        const results = await tasker.run();
        expect(results.length).to.eql(6);
      });
    });
    describe('with custom task', () => {
      it('should be issue', async () => {
        const tasker = new Tasker('x', {owner: 'x', repository: 'x'});
        const issues = Resolver.fixture('issues').data;
        tasker.add('sample', {filter: (issue) => issue.number === -1});
        Replacer.closer.default(tasker._closer, issues);
        const results = await tasker.run('sample');
        expect(results.length).to.eql(1);
      });
    });
    describe('with not found task', () => {
      it('should be issue', () => {
        const tasker = new Tasker('x', {owner: 'x', repository: 'x'});
        return expect(tasker.run('xxx')).to.eventually.be.rejectedWith(Error);
      });
    });
  });
});
