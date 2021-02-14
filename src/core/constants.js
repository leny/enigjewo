/* leny/enigjewo
 *
 * /src/core/constants.js - Constants
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

export const DEBUG = process.env.NODE_ENV !== "production";

export const MODE_MENU = "menu";
export const MODE_GAME = "game";
export const MODE_SETTINGS = "settings";
export const MODE_JOIN = "join";

export const GMAP_API_KEY = process.env.GMAP_API_KEY;
export const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
export const FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN;
export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
export const FIREBASE_DATABASE_URL = process.env.FIREBASE_DATABASE_URL;
export const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET;
export const FIREBASE_MESSAGE_SENDER_ID =
    process.env.FIREBASE_MESSAGE_SENDER_ID;
export const FIREBASE_APP_ID = process.env.FIREBASE_APP_ID;

export const SENTRY_DSN = process.env.SENTRY_DSN;
export const USE_SENTRY = process.env.NODE_ENV === "production";

export const DEFAULT_ROUNDS = 5;
export const DEFAULT_ROUND_DURATION = 300; // five minutes
export const DEFAULT_DIFFICULTY = 2000;

export const BSP = "\u0020";
export const NBSP = "\u00a0";
