'use strict';

/* eslint-env mocha */
/* eslint-disable max-nested-callbacks */

const fs = require('fs');
const util = require('util');
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = require('chai').expect;

const Command = require('command-line-test');

const DEST_PATH = path.join(__dirname, '/../fixtures/dest');
const FIXTURE_PATH = path.join(__dirname, '/../fixtures');

const unlinkConfigFile = () => util.promisify(fs.unlink)(path.join(DEST_PATH, './.icloser.js'));

describe('icloser', () => {
  describe('#init', () => {
    describe('with path is valid', () => {
      after(() => unlinkConfigFile());
      it('should be success', async () => {
        const command = new Command();
        const result = await command.exec(`node ./bin/icloser.js init --path=${DEST_PATH}`);
        expect(result.stderr).to.be.empty;
      });
      it('should be error', async () => {
        const command = new Command();
        const result = await command.exec(`node ./bin/icloser.js init --path=${DEST_PATH}www/wwww/wwww/www`);
        expect(result.stderr).to.be.not.empty;
      });
    });
  });
  describe('#default', () => {
    describe('with config file is not found', () => {
      it('should be error', async () => {
        const command = new Command();
        const result = await command.exec(`node ./bin/icloser.js --configPath=${DEST_PATH}/.icloser.js`);
        expect(result.stderr).to.be.not.empty;
      });
    });
    describe('with task is not found', () => {
      it('should be error', async () => {
        const command = new Command();
        const result = await command.exec(`node ./bin/icloser.js --configPath=${FIXTURE_PATH}/.icloser.js --task=dummy`);
        expect(result.stderr).to.be.not.empty;
      });
    });
  });
});
