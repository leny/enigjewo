/* leny/enigjewo
 *
 * /src/store/game/actions/join-match.js - Game Store Action: join match
 *
 * coded by leny@BeCode
 * started at 09/02/2021
 */

import {ACTION_JOIN_GAME} from "store/game/types";
// import {db} from "core/firebase";

export default settings => dispatch => {
    dispatch({type: ACTION_JOIN_GAME, ...settings});

    console.log("join(settings):", settings);
};
