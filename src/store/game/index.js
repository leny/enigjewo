/* leny/enigjewo
 *
 * /src/store/game/index.js - Store: game
 *
 * coded by leny@BeCode
 * started at 03/02/2021
 */

import {
    STEP_LOADING,
    STEP_PLAY,
    // STEP_RESULTS,
    ACTION_PREPARE_ROUND,
    ACTION_START_ROUND,
    ACTION_COMPUTE_RESULTS,
    ACTION_SHOW_RESULTS,
} from "./types";

// TODO: inject game options
export const initState = () => ({
    rounds: {
        total: 5,
        current: 1,
    },
    panoramas: [],
    positions: [],
    scores: [],
    step: STEP_LOADING,
});

export const reducer = (state, {type, ...payload}) => {
    switch (type) {
        case ACTION_PREPARE_ROUND:
            return {...state, step: STEP_PLAY};
        case ACTION_START_ROUND:
        case ACTION_COMPUTE_RESULTS:
        case ACTION_SHOW_RESULTS:
            return {...state, ...payload};
        // TODO: resolve actions
        default:
            throw new Error(`Unknown game store action: "${type}"!`);
    }
};
