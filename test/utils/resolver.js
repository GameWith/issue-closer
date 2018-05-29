'use strict';

const _ = require('lodash');
const path = require('path');

module.exports = {
  fixture: (fixtureName) => {
    return _.cloneDeep(require(path.join(__dirname, '../fixtures/', fixtureName)));
  }
};
