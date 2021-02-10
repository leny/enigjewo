/* leny/enigjewo
 *
 * /src/store/game/actions/receiving-player-results.js - Game Store Action: receiving player results
 *
 * coded by leny@BeCode
 * started at 10/02/2021
 */

import {ACTION_RECEIVE_PLAYER_RESULTS} from "store/game/types";

export default ({entries}) => dispatch => {
    dispatch({type: ACTION_RECEIVE_PLAYER_RESULTS, entries});
};
