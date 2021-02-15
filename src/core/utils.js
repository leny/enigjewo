/* leny/enigjewo
 *
 * /src/core/utils.js - Core Utils
 *
 * coded by leny@BeCode
 * started at 02/02/2021
 */

import Hashids from "hashids";
import Alea from "alea";

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

const increment = i => i + 1;

export const indexedArray = i => Array.from(new Array(i).keys(), increment);

const hashids = new Hashids(
    GMAP_API_KEY,
    0,
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
);
export const hashid = (value = Date.now()) => hashids.encode(+value);

export const generatePlayerKey = name =>
    hashid(
        Date.now() +
            name
                .split("")
                .map((s, i) => name.charCodeAt(i))
                .reduce((a, i) => a + i, 0),
    );

export const readableDuration = duration =>
    `${String(~~(duration / 60)).padStart(2, "0")}:${String(
        duration % 60,
    ).padStart(2, "0")}`;

export const readableDistance = distance =>
    distance > 2000 ? `${Math.floor(distance / 1000)}km` : `${distance}m`;

export const random = new Alea(`${GMAP_API_KEY}-${Date.now()}`);

export const computeScore = (distance, difficulty) =>
    distance < 50
        ? 5000
        : Math.min(
              5000,
              Math.max(
                  0,
                  Math.round(5000 * Math.exp(-(distance / 1000 / difficulty))),
              ),
          );
