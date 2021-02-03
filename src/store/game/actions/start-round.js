/* leny/enigjewo
 *
 * /src/store/game/actions/start-round.js - Game Store Action: start round
 *
 * coded by leny@BeCode
 * started at 03/02/2021
 */

import {ACTION_PREPARE_ROUND, ACTION_START_ROUND} from "store/game/types";

import {getRandomPanorama} from "core/street-view";

export default index => async dispatch => {
    dispatch({type: ACTION_PREPARE_ROUND, index});
    const {panorama, position} = await getRandomPanorama();
    dispatch({type: ACTION_START_ROUND, index, panorama, target: position});
};
