/* leny/enigjewo
 *
 * /src/store/game/actions/send-player-round-start-time.js - Game Store Action: send player round start time
 *
 * coded by leny@BeCode
 * started at 10/02/2021
 */

import {ACTION_SEND_PLAYER_ROUND_START_TIME} from "store/game/types";

import {db} from "core/firebase";

export default ({code, index, player}) => async dispatch => {
    const now = Date.now();

    await db.ref(`games/${code}/entries/rnd-${index}-${player}`).update({
        startedAt: now,
    });

    dispatch({
        type: ACTION_SEND_PLAYER_ROUND_START_TIME,
        now,
    });
};
