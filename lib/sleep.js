'use strict';

/**
 * Sleep promise
 * @param {Number} msec mill sec
 * @return {Promise<any>}
 */
module.exports = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

