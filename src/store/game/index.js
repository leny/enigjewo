/* leny/enigjewo
 *
 * /src/store/game/index.js - Store: game
 *
 * coded by leny@BeCode
 * started at 03/02/2021
 */

import {DEBUG} from "core/constants";
import {
    STEP_LOADING,
    STEP_LOBBY,
    STEP_PLAY,
    STEP_RESULTS,
    STEP_SUMMARY,
    ACTION_PREPARE_GAME,
    ACTION_SEND_SETTINGS,
    ACTION_PREPARE_ROUND,
    ACTION_START_ROUND,
    ACTION_PREPARE_RESULTS,
    ACTION_COMPUTE_RESULTS,
    ACTION_SHOW_RESULTS,
    ACTION_SHOW_SUMMARY,
} from "./types";

import {createContext} from "react";

export const GameStoreContext = createContext();

export const initState = () => ({
    code: null, // (multi) String: hash code to join game
    title: null, // (multi) String: title of the game
    settings: {
        // rounds Number
        // duration Number: round duration - in seconds (false for infinite)
        // isMulti Bool: is multiplayer game
        // map String
        // difficulty Number
        // bounds (local) Object - computed from map, cached in the store
    },
    player: null, // String: id of the current player
    players: {
        /*[player_id]: {
            name String
            isOwner (multi) Bool: is owner of the game - will run actions to initiate rounds
            score Number: computed from entries
            icon String
        }*/
    },
    rounds: {
        // one entry per round
        /*["rnd-X"] Object {
            panorama String: panorama id from StreetView
            target Object: latLng from StreetView
        }*/
    },
    entries: {
        // one entry per round per player
        /*{
            ["rnd-X-PLAYER_KEY"] Object {
                position Object: latLng of player's guess for the round
                distance Number: in meters
                score Number
                startedAt Number: timestamp
                endedAt Number: timestamp
            }
        }*/
    },
    currentRound: {
        index: 0,
        // startedAt (multi) Number: reference of start - for tempo & waiting for players
    },
    step: STEP_LOADING,
    ended: false,
});

export const reducer = (state, {type, ...payload}) => {
    DEBUG && console.log("DEBUG:reducer:", {type, payload});

    switch (type) {
        case ACTION_PREPARE_GAME: {
            const {
                code,
                title,
                rounds,
                duration,
                map,
                isMulti,
                player: {key, name, isOwner, icon},
            } = payload;

            return {
                ...state,
                code,
                title,
                settings: {
                    rounds,
                    duration,
                    isMulti,
                    map,
                },
                player: key,
                players: {
                    [key]: {
                        name,
                        isOwner,
                        score: 0,
                        icon,
                    },
                },
                step: STEP_LOADING,
            };
        }
        case ACTION_SEND_SETTINGS:
            return {
                ...state,
                step: STEP_LOBBY,
            };
        case ACTION_PREPARE_ROUND:
            return {
                ...state,
                currentRound: {
                    index: state.currentRound.index + 1,
                },
                step: STEP_LOADING,
            };
        case ACTION_START_ROUND: {
            const {panorama, target, difficulty, bounds, now} = payload;
            const key = `rnd-${state.currentRound.index}-${state.player}`;

            return {
                ...state,
                settings: {
                    ...state.settings,
                    difficulty,
                    bounds,
                },
                rounds: {
                    ...state.rounds,
                    [`rnd-${state.currentRound.index}`]: {
                        panorama,
                        target,
                    },
                },
                entries: {
                    ...state.entries,
                    [key]: {
                        startedAt: now,
                    },
                },
                currentRound: {
                    ...state.currentRound,
                    startedAt: now,
                },
                step: STEP_PLAY,
            };
        }
        case ACTION_PREPARE_RESULTS: {
            const {now} = payload;
            const key = `rnd-${state.currentRound.index}-${state.player}`;

            return {
                ...state,
                entries: {
                    ...state.entries,
                    [key]: {
                        ...state.entries[key],
                        endedAt: now,
                    },
                },
                step: STEP_LOADING,
            };
        }
        case ACTION_COMPUTE_RESULTS: {
            const {position} = payload;
            const key = `rnd-${state.currentRound.index}-${state.player}`;

            return {
                ...state,
                entries: {
                    ...state.entries,
                    [key]: {
                        ...state.entries[key],
                        position,
                    },
                },
                step: STEP_LOADING,
            };
        }
        case ACTION_SHOW_RESULTS: {
            const {distance, score} = payload;
            const key = `rnd-${state.currentRound.index}-${state.player}`;

            return {
                ...state,
                players: {
                    ...state.players,
                    [state.player]: {
                        ...state.players[state.player],
                        score: Array.from(
                            new Array(state.currentRound.index - 1).keys(),
                            i => i + 1,
                        ).reduce(
                            (acc, ind) =>
                                acc +
                                state.entries[`rnd-${ind}-${state.player}`]
                                    .score,
                            score,
                        ),
                    },
                },
                entries: {
                    ...state.entries,
                    [key]: {
                        ...state.entries[key],
                        distance,
                        score,
                    },
                },
                step: STEP_RESULTS,
                ended: state.currentRound.index === state.settings.rounds,
            };
        }
        case ACTION_SHOW_SUMMARY:
            return {...state, step: STEP_SUMMARY};
        default:
            return state;
    }
};
