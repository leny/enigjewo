/* leny/enigjewo
 *
 * /src/containers/game.js - Game Container
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import "styles/game.scss";

import {useEffect, useCallback} from "react";
import PropTypes from "prop-types";
import {useThunkedReducer} from "core/hooks/use-thunked-reducer";

import {DEBUG} from "core/constants";
import {
    STEP_LOBBY,
    STEP_PLAY,
    STEP_RESULTS,
    STEP_SUMMARY,
} from "store/game/types";
import {initState, reducer, GameStoreContext} from "store/game";
import startMatch from "store/game/actions/start-match";
import joinMatch from "store/game/actions/join-match";
import continueMatch from "store/game/actions/continue-match";
import startRound from "store/game/actions/start-round";
import computeResults from "store/game/actions/compute-results";
import endMatch from "store/game/actions/end-match";
import injectGameSummary from "store/game/actions/inject-game-summary";

import Loading from "components/game/loading";
import Lobby from "components/game/lobby";
import Play from "components/game/play";
import Results from "components/game/results";
import Summary from "components/game/summary";

const {Provider: GameStoreContextProvider} = GameStoreContext;

const GameContainer = ({settings, onRestart}) => {
    const [state, dispatch] = useThunkedReducer(reducer, null, initState);
    DEBUG && console.log("DEBUG:state:", state);

    const handleFinishRound = useCallback(
        position => dispatch(computeResults(position, state)),
        [state],
    );

    const handleNextRound = useCallback(() => dispatch(startRound(state)), [
        state,
    ]);

    const handleEndMatch = useCallback(() => dispatch(endMatch()), []);

    const handleRestart = useCallback(() => onRestart(), [onRestart]);

    // launch match
    useEffect(() => {
        if (settings.ended) {
            dispatch(injectGameSummary(settings.game));
            return;
        }
        if (settings.continue) {
            dispatch(continueMatch(settings));
            return;
        }
        if (settings.join) {
            dispatch(joinMatch(settings));
            return;
        }
        dispatch(startMatch(settings));
    }, []);

    useEffect(() => {
        const html = document.querySelector("html");

        html.classList.add("game-page");

        return () => html.classList.remove("game-page");
    }, []);

    if (state.step === STEP_SUMMARY) {
        return (
            <GameStoreContextProvider value={{...state, dispatch}}>
                <Summary onRestart={handleRestart} />
            </GameStoreContextProvider>
        );
    }

    if (state.step === STEP_RESULTS) {
        return (
            <GameStoreContextProvider value={{...state, dispatch}}>
                <Results onNext={handleNextRound} onEnd={handleEndMatch} />
            </GameStoreContextProvider>
        );
    }

    if (state.step === STEP_PLAY) {
        return (
            <GameStoreContextProvider value={{...state, dispatch}}>
                <Play onFinishRound={handleFinishRound} />
            </GameStoreContextProvider>
        );
    }

    if (state.step === STEP_LOBBY) {
        return (
            <GameStoreContextProvider value={{...state, dispatch}}>
                <Lobby onStartMatch={handleNextRound} />
            </GameStoreContextProvider>
        );
    }

    // state === STEP_LOADING
    return (
        <GameStoreContextProvider value={{...state, dispatch}}>
            <Loading />
        </GameStoreContextProvider>
    );
};

GameContainer.propTypes = {
    settings: PropTypes.object,
};

export default GameContainer;
