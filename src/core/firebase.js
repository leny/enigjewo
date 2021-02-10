/* leny/enigjewo
 *
 * /src/core/firebase.js - Firebase wrapper
 *
 * coded by leny@BeCode
 * started at 09/02/2021
 */

import firebase from "firebase/app";
import "firebase/database";

import {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_DATABASE_URL,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGE_SENDER_ID,
    FIREBASE_APP_ID,
} from "core/constants";

firebase.initializeApp({
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    databaseURL: FIREBASE_DATABASE_URL,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGE_SENDER_ID,
    appId: FIREBASE_APP_ID,
});

export const db = firebase.database();

export const cleanGame = code => async () => {
    const game = (await db.ref(`games/${code}`).once("value")).val();

    !game.started && db.ref(`games/${code}`).remove();
};
