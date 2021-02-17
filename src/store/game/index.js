/* leny/enigjewo
 *
 * /src/store/game/index.js - Store: game
 *
 * coded by leny@BeCode
 * started at 03/02/2021
 */

import {DEBUG} from "core/constants";
import {indexedArray} from "core/utils";
import {
    STEP_LOADING,
    STEP_LOBBY,
    STEP_PLAY,
    STEP_RESULTS,
    STEP_SUMMARY,
    ACTION_PREPARE_GAME,
    ACTION_JOIN_GAME,
    ACTION_CONTINUE_GAME,
    ACTION_SEND_PLAYER_INFOS,
    ACTION_RECEIVE_PLAYER_INFOS,
    ACTION_SEND_SETTINGS,
    ACTION_PREPARE_ROUND,
    ACTION_PROGRESS_INDICATION,
    ACTION_START_ROUND,
    ACTION_SEND_PLAYER_ROUND_START_TIME,
    ACTION_DEACTIVATE_PLAYER,
    ACTION_PREPARE_RESULTS,
    ACTION_COMPUTE_RESULTS,
    ACTION_RECEIVE_PLAYER_RESULTS,
    ACTION_SHOW_RESULTS,
    ACTION_SHOW_SUMMARY,
    ACTION_SEND_ENDED_GAME,
    ACTION_INJECT_SUMMARY,
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
            isActive (multi) Bool: is active - can be marked unactive to continue game if player has issue
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
    progressCount: 0, // count of location attempt
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
        settings: {rounds, duration: duration || false, isMulti, map},
        player: key,
        players: {
            [key]: {
                name,
                isOwner,
                isActive: true,
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

reducersMap.set(ACTION_CONTINUE_GAME, (state, game) => ({
    ...state,
    ...game,
    settings: {
        ...game.settings,
        isMulti: true,
    },
    players: Object.fromEntries(
        Object.entries(game.players).map(([key, player]) => [
            key,
            {
                ...player,
                score: indexedArray(game.settings.rounds).reduce(
                    (acc, ind) =>
                        acc + (game.entries[`rnd-${ind}-${key}`]?.score || 0),
                    0,
                ),
            },
        ]),
    ),
    step: STEP_RESULTS,
}));

reducersMap.set(
    ACTION_SEND_PLAYER_INFOS,
    (state, {code, title, settings, players, player}) => ({
        ...state,
        code,
        title,
        settings: {
            ...settings,
            duration: settings.duration === 0 ? false : settings.duration,
            isMulti: true,
        },
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
    progressCount: 0,
}));

reducersMap.set(ACTION_PROGRESS_INDICATION, (state, {count}) => ({
    ...state,
    progressCount: count,
}));

reducersMap.set(
    ACTION_START_ROUND,
    (state, {index, panorama, target, difficulty, bounds, now}) => {
        const key = `rnd-${index}-${state.player}`;

        return {
            ...state,
            settings: {
                ...state.settings,
                difficulty,
                bounds,
            },
            rounds: {
                ...state.rounds,
                [`rnd-${index}`]: {
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
                index,
                startedAt: now,
            },
            step: STEP_PLAY,
        };
    },
);

reducersMap.set(ACTION_SEND_PLAYER_ROUND_START_TIME, (state, {now}) => {
    const key = `rnd-${state.currentRound.index}-${state.player}`;

    return {
        ...state,
        entries: {
            ...state.entries,
            [key]: {
                ...(state.entries[key] || {}),
                startedAt: now,
            },
        },
    };
});

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
        progressCount: 0,
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
                score: indexedArray(state.currentRound.index - 1).reduce(
                    (acc, ind) =>
                        acc +
                        (state.entries[`rnd-${ind}-${state.player}`].score ||
                            0),
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

reducersMap.set(ACTION_DEACTIVATE_PLAYER, (state, {player}) => ({
    ...state,
    players: {
        ...state.players,
        [player]: {
            ...state.players[player],
            isActive: false,
        },
    },
}));

reducersMap.set(ACTION_RECEIVE_PLAYER_RESULTS, (state, {entries}) => ({
    ...state,
    entries,
    players: Object.fromEntries(
        Object.entries(state.players).map(([key, player]) => [
            key,
            {
                ...player,
                isActive: true,
                score: indexedArray(state.currentRound.index).reduce(
                    (acc, ind) =>
                        acc + (entries[`rnd-${ind}-${key}`]?.score || 0),
                    0,
                ),
            },
        ]),
    ),
}));

reducersMap.set(ACTION_SHOW_SUMMARY, state => ({
    ...state,
    step: STEP_SUMMARY,
}));

reducersMap.set(ACTION_SEND_ENDED_GAME, state => ({
    ...state,
    ended: true,
}));

reducersMap.set(ACTION_INJECT_SUMMARY, (state, game) => ({
    ...state,
    ...game,
    settings: {
        ...game.settings,
        isMulti: true,
    },
    player: Object.keys(game.players)[0],
    players: Object.fromEntries(
        Object.entries(game.players).map(([key, player]) => [
            key,
            {
                ...player,
                score: indexedArray(game.settings.rounds).reduce(
                    (acc, ind) =>
                        acc + (game.entries[`rnd-${ind}-${key}`].score || 0),
                    0,
                ),
            },
        ]),
    ),
    step: STEP_SUMMARY,
    ended: true,
    injected: true,
}));

export const reducer = (state, {type, ...payload}) => {
    DEBUG && console.log("DEBUG:reducer:", {type, payload});

    return reducersMap.has(type)
        ? reducersMap.get(type)(state, payload)
        : state;
};
