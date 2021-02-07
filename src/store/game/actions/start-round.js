/* leny/enigjewo
 *
 * /src/store/game/actions/start-round.js - Game Store Action: start round
 *
 * coded by leny@BeCode
 * started at 03/02/2021
 */

import {DEFAULT_DIFFICULTY} from "core/constants";
import {ACTION_PREPARE_ROUND, ACTION_START_ROUND} from "store/game/types";
import bbox from "@turf/bbox";

import {getRandomPanorama} from "core/street-view";
import {getGeoJSONDifficulty} from "core/geo-utils";
import {loadGeoJSON} from "core/maps";

export default map => async dispatch => {
    dispatch({type: ACTION_PREPARE_ROUND});

    if (map === "world") {
        const {panorama, position} = await getRandomPanorama();
        dispatch({
            type: ACTION_START_ROUND,
            panorama,
            bounds: null,
            target: position,
            difficulty: DEFAULT_DIFFICULTY,
        });
        return;
    }

    const geoJSON = await loadGeoJSON(map);
    const [west, south, east, north] = bbox(geoJSON);
    const difficulty = getGeoJSONDifficulty(geoJSON);
    const {panorama, position} = await getRandomPanorama(geoJSON);

    dispatch({
        type: ACTION_START_ROUND,
        panorama,
        bounds: {north, east, south, west},
        target: position,
        difficulty,
    });
};
