/* leny/enigjewo
 *
 * /src/store/game/actions/continue-match.js - Game Store Action: continue match
 *
 * coded by leny@BeCode
 * started at 15/02/2021
 */

import {ACTION_JOIN_GAME, ACTION_CONTINUE_GAME} from "store/game/types";
import {db} from "core/firebase";
import {indexedArray, computeScore} from "core/utils";
import {getRandomLatLng, computeDistanceBetween} from "core/geo-utils";
import {loadGeoJSON} from "core/maps";

export default ({code, player: {key}}) => async dispatch => {
    dispatch({type: ACTION_JOIN_GAME});

    const now = Date.now();
    const {
        currentRound: {index},
        rounds,
        entries,
        settings: {map, difficulty},
    } = (await db.ref(`games/${code}`).get()).val();

    await Promise.all(
        indexedArray(index).map(async i => {
            const {target} = rounds[`rnd-${i}`];
            const entry = entries[`rnd-${i}-${key}`];
            if (!entry || !entry.position) {
                let geoJSON;
                if (map !== "world") {
                    geoJSON = await loadGeoJSON(map);
                }
                const {position} = getRandomLatLng(geoJSON);

                const distance = Math.floor(
                    computeDistanceBetween(target, position),
                );
                const score = computeScore(distance, difficulty);

                if (!entry) {
                    await db.ref(`games/${code}/entries/rnd-${i}-${key}`).set({
                        position,
                        distance,
                        score,
                        startedAt: now,
                        endedAt: now + 1000,
                    });
                } else {
                    await db
                        .ref(`games/${code}/entries/rnd-${i}-${key}`)
                        .update({
                            position,
                            distance,
                            score,
                            endedAt: now,
                        });
                }
            }

            return Promise.resolve(true);
        }),
    );
    await db.ref(`games/${code}/players/${key}`).update({
        isActive: true,
    });

    const game = (await db.ref(`games/${code}`).get()).val();

    dispatch({type: ACTION_CONTINUE_GAME, ...game, player: key});
};
