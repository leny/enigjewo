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
    ACTION_JOIN_GAME,
    ACTION_SEND_PLAYER_INFOS,
    ACTION_RECEIVE_PLAYER_INFOS,
    ACTION_SEND_SETTINGS,
    ACTION_PREPARE_ROUND,
    ACTION_SEND_ROUND_PARAMS,
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

const reducersMap = new Map();

reducersMap.set(
    ACTION_PREPARE_GAME,
    (
        state,
        {
            code,
            title,
            rounds,
            duration,
            map,
            isMulti,
            player: {key, name, isOwner, icon},
        },
    ) => ({
        ...state,
        code,
        title,
        settings: {rounds, duration, isMulti, map},
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
    }),
);

reducersMap.set(ACTION_SEND_SETTINGS, state => ({
    ...state,
    step: STEP_LOBBY,
}));

reducersMap.set(ACTION_JOIN_GAME, state => ({...state, step: STEP_LOADING}));

reducersMap.set(
    ACTION_SEND_PLAYER_INFOS,
    (state, {code, title, settings, players, player}) => ({
        ...state,
        code,
        title,
        settings: {...settings, isMulti: true},
        players: {
            ...players,
            [player]: {
                ...players[player],
                score: 0,
            },
        },
        player,
        step: STEP_LOBBY,
    }),
);

reducersMap.set(ACTION_RECEIVE_PLAYER_INFOS, (state, {key, player}) => ({
    ...state,
    players: {
        ...state.players,
        [key]: {
            ...player,
            score: 0,
        },
    },
}));

reducersMap.set(ACTION_PREPARE_ROUND, state => ({
    ...state,
    currentRound: {
        index: state.currentRound.index + 1,
    },
    step: STEP_LOADING,
}));

reducersMap.set(ACTION_SEND_ROUND_PARAMS, state => ({
    ...state,
    currentRound: {
        index: state.currentRound.index + 1,
    },
}));

reducersMap.set(
    ACTION_START_ROUND,
    (state, {panorama, target, difficulty, bounds, now}) => {
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
    },
);

reducersMap.set(ACTION_PREPARE_RESULTS, (state, {now}) => {
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
});

reducersMap.set(ACTION_COMPUTE_RESULTS, (state, {position}) => {
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
});

reducersMap.set(ACTION_SHOW_RESULTS, (state, {distance, score}) => {
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
                        acc + state.entries[`rnd-${ind}-${state.player}`].score,
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
});

reducersMap.set(ACTION_SHOW_SUMMARY, state => ({
    ...state,
    step: STEP_SUMMARY,
}));

export const reducer = (state, {type, ...payload}) => {
    DEBUG && console.log("DEBUG:reducer:", {type, payload});

    return reducersMap.has(type)
        ? reducersMap.get(type)(state, payload)
        : state;
};
