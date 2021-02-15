/* leny/enigjewo
 *
 * /src/store/game/actions/join-match.js - Game Store Action: join match
 *
 * coded by leny@BeCode
 * started at 09/02/2021
 */

import {ACTION_JOIN_GAME, ACTION_SEND_PLAYER_INFOS} from "store/game/types";
import {db} from "core/firebase";

export default settings => async dispatch => {
    dispatch({type: ACTION_JOIN_GAME});

    const {
        code,
        player: {key, icon, name, isOwner},
    } = settings;

    await db.ref(`games/${code}/players`).update({
        [key]: {icon, name, isOwner, isActive: true},
    });

    const game = (await db.ref(`games/${code}`).get()).val();

    dispatch({type: ACTION_SEND_PLAYER_INFOS, ...game, player: key});
};
