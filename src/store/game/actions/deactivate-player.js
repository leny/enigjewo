/* leny/enigjewo
 *
 * /src/store/game/actions/deactivate-player.js - Game Store Action: deactivate player
 *
 * coded by leny@BeCode
 * started at 10/02/2021
 */

import {ACTION_DEACTIVATE_PLAYER} from "store/game/types";

import {db} from "core/firebase";

export default (code, player) => async dispatch => {
    await db.ref(`games/${code}/players/${player}`).update({
        isActive: false,
    });

    dispatch({
        type: ACTION_DEACTIVATE_PLAYER,
        player,
    });
};
