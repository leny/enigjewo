/* leny/enigjewo
 *
 * /src/store/game/actions/compute-results.js - Game Store Action: compute results
 *
 * coded by leny
 * started at 03/02/2021
 */

import {
    ACTION_PREPARE_RESULTS,
    ACTION_COMPUTE_RESULTS,
    ACTION_SHOW_RESULTS,
} from "store/game/types";

import {GAME_RULES_GUESS_COUNTRY} from "core/constants";

import {db} from "core/firebase";
import {getRandomLatLng, computeDistanceBetween} from "core/geo-utils";
import {getCountryFromPosition} from "core/geocoder";
import {computeScore} from "core/utils";
import {loadGeoJSON} from "core/maps";

export default (
        pos,
        {
            code,
            settings: {map, difficulty, isMulti, rules},
            rounds,
            currentRound: {index: round},
            player,
        },
    ) =>
    async dispatch => {
        const now = Date.now();
        const {target, country: targetCountry} = rounds[`rnd-${round}`];
        dispatch({type: ACTION_PREPARE_RESULTS, now});
        let position = pos,
            geoJSON;
        if (!position) {
            if (map !== "world") {
                geoJSON = await loadGeoJSON(map);
            }
            position = getRandomLatLng(geoJSON).position;
        }

        dispatch({type: ACTION_COMPUTE_RESULTS, position});
        let distance = null,
            score,
            country = null;

        if (rules === GAME_RULES_GUESS_COUNTRY) {
            country = await getCountryFromPosition(position);
            score = country === targetCountry ? 1 : 0;
        } else {
            distance = Math.floor(computeDistanceBetween(target, position));
            score = computeScore(distance, difficulty);
        }

        if (isMulti) {
            await db
                .ref(`games/${code}/entries/rnd-${round}-${player}`)
                .update({
                    position,
                    distance,
                    score,
                    country,
                    endedAt: now,
                });
            await db.ref(`games/${code}/players/${player}`).update({
                isActive: true,
            });
        }

        dispatch({
            type: ACTION_SHOW_RESULTS,
            distance,
            score,
            country,
        });
    };
