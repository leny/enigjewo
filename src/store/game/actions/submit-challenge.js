/* leny/enigjewo
 *
 * /src/store/game/actions/submit-challenge.js - Game Store Action: submit challenge
 *
 * coded by leny
 * started at 30/01/2022
 */

import {
    ACTION_PREPARE_CHALLENGE,
    // ACTION_SHOW_RESULTS
} from "store/game/types";

export default (state, {title, player}) =>
    dispatch => {
        dispatch({type: ACTION_PREPARE_CHALLENGE});

        console.log("submitChallenge(state, {title,player}):", {
            state,
            title,
            player,
        });

        // TODO
    };
