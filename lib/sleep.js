'use strict';

/**
 * Sleep promise
 * @param {Number} msec mill sec
 * @return {Promise<any>}
 */
module.exports = (msec) => {
  return new Promise((resolve) => {
    return setTimeout(resolve, msec);
  });
};
