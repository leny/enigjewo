/* leny/enigjewo
 *
 * /src/store/game/actions/receiving-round-params.js - Game Store Action: receiving round params
 *
 * coded by leny@BeCode
 * started at 10/02/2021
 */

import {ACTION_START_ROUND} from "store/game/types";

import {db} from "core/firebase";

export default code => async dispatch => {
    const game = (await db.ref(`games/${code}`).once("value")).val();

    const {
        settings: {bounds, difficulty},
        rounds,
        currentRound: {index},
    } = game;
    const {panorama, target} = rounds[`rnd-${index}`];

    dispatch({
        type: ACTION_START_ROUND,
        index,
        bounds,
        difficulty,
        now: Date.now(),
        panorama,
        target,
    });
};
