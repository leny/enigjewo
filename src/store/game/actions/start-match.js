/* leny/enigjewo
 *
 * /src/store/game/actions/start-match.js - Game Store Action: start match
 *
 * coded by leny@BeCode
 * started at 08/02/2021
 */

import {ACTION_PREPARE_GAME} from "store/game/types";

export default settings => dispatch => {
    dispatch({type: ACTION_PREPARE_GAME, ...settings});
};
