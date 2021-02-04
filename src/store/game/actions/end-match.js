/* leny/enigjewo
 *
 * /src/store/game/actions/end-match.js - Game Store Action: end match
 *
 * coded by leny@BeCode
 * started at 03/02/2021
 */

import {ACTION_SHOW_SUMMARY} from "store/game/types";

export default () => dispatch => {
    dispatch({type: ACTION_SHOW_SUMMARY});
};
