/* leny/enigjewo
 *
 * /src/store/game/actions/join-match.js - Game Store Action: join match
 *
 * coded by leny
 * started at 09/02/2021
 */

import {
    ACTION_JOIN_GAME,
    ACTION_SEND_PLAYER_INFOS,
    ACTION_INJECT_SUMMARY,
    ACTION_SHOW_SUMMARY,
} from "store/game/types";
import {db} from "core/firebase";

export default settings => async dispatch => {
    dispatch({type: ACTION_JOIN_GAME});

    const {
        code,
        player: {key, icon, name, isOwner},
    } = settings;

    const players = (await db.ref(`games/${code}/players`).get()).val();

    if (Object.values(players).find(player => player.name === name)) {
        const endedGame = (await db.ref(`games/${code}`).get()).val();
        dispatch({type: ACTION_INJECT_SUMMARY, ...endedGame});
        dispatch({type: ACTION_SHOW_SUMMARY});
        return;
    }

    await db.ref(`games/${code}/players`).update({
        [key]: {icon, name, isOwner, isActive: true},
    });

    const game = (await db.ref(`games/${code}`).get()).val();

    dispatch({type: ACTION_SEND_PLAYER_INFOS, ...game, player: key});
};
