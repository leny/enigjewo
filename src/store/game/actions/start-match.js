/* leny/enigjewo
 *
 * /src/store/game/actions/start-match.js - Game Store Action: start match
 *
 * coded by leny@BeCode
 * started at 08/02/2021
 */

import {ACTION_PREPARE_GAME, ACTION_SEND_SETTINGS} from "store/game/types";
import startRound from "store/game/actions/start-round";

import {db, cleanGame} from "core/firebase";

export default settings => dispatch => {
    dispatch({type: ACTION_PREPARE_GAME, ...settings});

    if (settings.isMulti === false) {
        dispatch(startRound({settings}));
        return;
    }

    const {
        code,
        title,
        map,
        rounds,
        duration,
        player: {key, icon, name, isOwner},
    } = settings;
    const game = {
        code,
        title,
        settings: {
            map,
            rounds,
            duration,
        },
        rounds: {},
        entries: {},
        players: {
            [key]: {
                icon,
                name,
                isOwner,
                isActive: true,
            },
        },
        startedAt: Date.now(),
        started: false,
        ended: false,
    };

    db.ref(`games/${code}`).set(game);
    window.addEventListener("unload", cleanGame(code));
    dispatch({type: ACTION_SEND_SETTINGS});
};
