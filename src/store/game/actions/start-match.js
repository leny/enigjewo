/* leny/enigjewo
 *
 * /src/store/game/actions/start-match.js - Game Store Action: start match
 *
 * coded by leny@BeCode
 * started at 08/02/2021
 */

import {ACTION_PREPARE_GAME, ACTION_SEND_SETTINGS} from "store/game/types";
import startRound from "store/game/actions/start-round";

export default settings => dispatch => {
    dispatch({type: ACTION_PREPARE_GAME, ...settings});

    if (settings.isMulti === false) {
        dispatch(startRound({settings}));
        return;
    }

    // TODO: send settings to firebase
    dispatch({type: ACTION_SEND_SETTINGS});
};
