/* leny/enigjewo
 *
 * /src/store/game/actions/receiving-player-infos.js - Game Store Action: receiving player infos
 *
 * coded by leny@BeCode
 * started at 10/02/2021
 */

import {ACTION_RECEIVE_PLAYER_INFOS} from "store/game/types";

export default payload => dispatch => {
    dispatch({type: ACTION_RECEIVE_PLAYER_INFOS, ...payload});
};
