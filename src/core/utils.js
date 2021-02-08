/* leny/enigjewo
 *
 * /src/core/utils.js - Core Utils
 *
 * coded by leny@BeCode
 * started at 02/02/2021
 */

import Hashids from "hashids";

import {GMAP_API_KEY} from "core/constants";

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

const hashids = new Hashids(
    GMAP_API_KEY,
    0,
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
);
export const hashid = (value = Date.now()) => hashids.encode(value);
