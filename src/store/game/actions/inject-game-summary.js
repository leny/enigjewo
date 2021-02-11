/* leny/enigjewo
 *
 * /src/store/game/actions/inject-game-summary.js - Game Store Action: inject game summary
 *
 * coded by leny@BeCode
 * started at 11/02/2021
 */

import {ACTION_INJECT_SUMMARY} from "store/game/types";

export default game => dispatch => {
    dispatch({type: ACTION_INJECT_SUMMARY, ...game});
};
