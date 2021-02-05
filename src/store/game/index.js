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
    STEP_SUMMARY,
    ACTION_PREPARE_ROUND,
    ACTION_START_ROUND,
    ACTION_COMPUTE_RESULTS,
    ACTION_SHOW_RESULTS,
    ACTION_SHOW_SUMMARY,
} from "./types";

import {createContext} from "react";

export const GameStoreContext = createContext();

// TODO: inject game options
export const initState = () => ({
    difficulty: DEFAULT_DIFFICULTY,
    rounds: {
        total: 2,
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
    ended: false,
});

export const reducer = (state, {type, ...payload}) => {
    DEBUG && console.log("DEBUG:reducer:", {type, payload});

    switch (type) {
        case ACTION_PREPARE_ROUND:
            return {
                ...state,
                rounds: {
                    ...state.rounds,
                    current: state.rounds.current + 1,
                },
                currentRound: null,
                step: STEP_LOADING,
            };
        case ACTION_START_ROUND: {
            const {panorama, target} = payload;

            return {
                ...state,
                panoramas: [...state.panoramas, panorama],
                targets: [...state.targets, target],
                currentRound: {
                    index: state.rounds.current,
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
                currentRound: {
                    ...state.currentRound,
                    score: [...state.scores, score].reduce(
                        (acc, elt) => acc + elt,
                        0,
                    ),
                },
                step: STEP_RESULTS,
                ended: state.rounds.current === state.rounds.total,
            };
        }
        case ACTION_SHOW_SUMMARY:
            return {...state, step: STEP_SUMMARY};
        default:
            return state;
    }
};
