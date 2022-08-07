/* leny/enigjewo
 *
 * /src/store/game/actions/submit-challenge.js - Game Store Action: submit challenge
 *
 * coded by leny
 * started at 30/01/2022
 */

import {GAME_VARIANT_CHALLENGE} from "core/constants";
import {
    ACTION_PREPARE_CHALLENGE,
    ACTION_SHOW_CHALLENGE_SUMMARY,
} from "store/game/types";
import {db} from "core/firebase";

export default (state, {title, player}) =>
    dispatch => {
        dispatch({type: ACTION_PREPARE_CHALLENGE, title, player});

        const oldPlayer = state.players[state.player];
        const {code, settings, rounds, entries} = state;
        const {key, icon, name} = player;

        const game = {
            code,
            variant: GAME_VARIANT_CHALLENGE,
            title,
            settings: {
                map: settings.map,
                rounds: settings.rounds,
                duration: settings.duration,
                rules: settings.rules,
            },
            rounds,
            entries: Object.fromEntries(
                Object.entries(state.entries).map(([k, v]) => [
                    k.endsWith(state.player) ? k.replace(state.player, key) : k,
                    v,
                ]),
            ),
            players: {
                [key]: {...oldPlayer, icon, name},
            },
            startedAt: entries[`rnd-1-${state.player}`].startedAt,
            started: true,
            ended: true,
        };

        db.ref(`games/${code}`).set(game);
        dispatch({type: ACTION_SHOW_CHALLENGE_SUMMARY});
    };
