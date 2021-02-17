/* leny/enigjewo
 *
 * /src/store/game/types.js - Store: game types
 *
 * coded by leny@BeCode
 * started at 03/02/2021
 */

export const STEP_LOADING = "loading";
export const STEP_LOBBY = "lobby";
export const STEP_PLAY = "play";
export const STEP_COMPUTE = "compute";
export const STEP_RESULTS = "results";
export const STEP_SUMMARY = "summary";

export const ACTION_PREPARE_GAME = "store.game.actions.action_prepare_game";
export const ACTION_SEND_SETTINGS = "store.game.actions.action_send_settings";
export const ACTION_JOIN_GAME = "store.game.actions.action_join_game";
export const ACTION_CONTINUE_GAME = "store.game.actions.action_continue_game";
export const ACTION_PROGRESS_INDICATION =
    "store.game.actions.action_progress_indication";
export const ACTION_SEND_PLAYER_INFOS =
    "store.game.actions.action_send_player_infos";
export const ACTION_WAIT_FOR_PLAYERS =
    "store.game.actions.action_wait_for_players";
export const ACTION_RECEIVE_PLAYER_INFOS =
    "store.game.actions.action_receive_player_infos";
export const ACTION_START_GAME = "store.game.actions.action_start_game";
export const ACTION_PREPARE_ROUND = "store.game.actions.action_prepare_round";
export const ACTION_SEND_ROUND_PARAMS =
    "store.game.actions.action_send_round_params";
export const ACTION_RECEIVE_ROUND_PARAMS =
    "store.game.actions.action_receive_round_params";
export const ACTION_START_ROUND = "store.game.actions.action_start_round";
export const ACTION_SEND_PLAYER_ROUND_START_TIME =
    "store.game.actions.action_send_player_round_start_time";
export const ACTION_DEACTIVATE_PLAYER =
    "store.game.actions.action_deactivate_player";
export const ACTION_PREPARE_RESULTS =
    "store.game.actions.action_prepare_results";
export const ACTION_COMPUTE_RESULTS =
    "store.game.actions.action_compute_results";
export const ACTION_SEND_RESULTS = "store.game.actions.action_send_results";
export const ACTION_SHOW_RESULTS = "store.game.actions.action_show_results";
export const ACTION_WAIT_FOR_PLAYERS_RESULTS =
    "store.game.actions.action_wait_for_players_results";
export const ACTION_RECEIVE_PLAYER_RESULTS =
    "store.game.actions.action_receive_player_results";
export const ACTION_SEND_ENDED_GAME =
    "store.game.actions.action_send_ended_game";
export const ACTION_SHOW_SUMMARY = "store.game.actions.action_show_summary";
export const ACTION_INJECT_SUMMARY = "store.game.actions.action_inject_summary";
