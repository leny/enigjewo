/* leny/enigjewo
 *
 * /src/store/game/index.js - Store: game
 *
 * coded by leny@BeCode
 * started at 03/02/2021
 */

import {
    DEBUG,
    DEFAULT_ROUND_DURATION,
    DEFAULT_DIFFICULTY,
} from "core/constants";
import {
    STEP_LOADING,
    STEP_PLAY,
    STEP_RESULTS,
    // STEP_SUMMARY,
    ACTION_PREPARE_ROUND,
    ACTION_START_ROUND,
    ACTION_COMPUTE_RESULTS,
    ACTION_SHOW_RESULTS,
} from "./types";

import {createContext} from "react";

export const GameStoreContext = createContext();

// TODO: inject game options
export const initState = () => ({
    difficulty: DEFAULT_DIFFICULTY,
    rounds: {
        total: 5,
        current: 0,
        duration: DEFAULT_ROUND_DURATION,
    },
    currentRound: null /* {
        index: 0,
        panorama: null,
        score: 0,
    } */,
    panoramas: [],
    targets: [],
    positions: [],
    distances: [],
    scores: [],
    step: STEP_LOADING,
});

export const reducer = (state, {type, ...payload}) => {
    DEBUG && console.log("DEBUG:reducer:", {type, payload});

    switch (type) {
        case ACTION_PREPARE_ROUND:
            return {
                ...state,
                rounds: {
                    ...state.rounds,
                    current: payload.index,
                },
                currentRound: null,
                step: STEP_LOADING,
            };
        case ACTION_START_ROUND: {
            const {index, panorama, target} = payload;

            return {
                ...state,
                panoramas: [...state.panoramas, panorama],
                targets: [...state.targets, target],
                currentRound: {
                    index,
                    panorama,
                    score: state.scores.reduce((acc, elt) => acc + elt, 0),
                },
                step: STEP_PLAY,
            };
        }
        case ACTION_COMPUTE_RESULTS: {
            const {position} = payload;

            return {
                ...state,
                positions: [...state.positions, position],
                step: STEP_LOADING,
            };
        }
        case ACTION_SHOW_RESULTS: {
            const {distance, score} = payload;

            return {
                ...state,
                scores: [...state.scores, score],
                distances: [...state.distances, distance],
                step: STEP_RESULTS,
            };
        }
        default:
            return state;
    }
};
