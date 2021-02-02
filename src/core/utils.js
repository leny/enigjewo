/* leny/enigjewo
 *
 * /src/core/utils.js - Core Utils
 *
 * coded by leny@BeCode
 * started at 02/02/2021
 */

export const isTruthy = m => !!m;
export const isFalsy = m => !m;
export const invertValue = isFalsy;

// eslint-disable-next-line no-empty-function
export const noop = () => {};

export const preventDefault = next => e => {
    e.preventDefault();
    next(e);
};

export const withValue = next => e => next(e.currentTarget.value);
