/* leny/enigjewo
 *
 * /src/store/game/actions/send-end-game-state.js - Game Store Action: send end game state
 *
 * coded by leny@BeCode
 * started at 11/02/2021
 */

import {ACTION_SEND_ENDED_GAME} from "store/game/types";

import {db} from "core/firebase";

export default ({code}) => async dispatch => {
    await db.ref(`games/${code}`).update({
        ended: true,
        endedAt: Date.now(),
    });

    dispatch({
        type: ACTION_SEND_ENDED_GAME,
    });
};
