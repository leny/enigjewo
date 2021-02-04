/* leny/enigjewo
 *
 * /src/containers/game.js - Game Container
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

/* eslint-disable */ // WIP

import "styles/game.scss";

import {useEffect, useCallback} from "react";
import {useThunkedReducer} from "core/hooks/use-thunked-reducer";

import {STEP_PLAY, STEP_RESULTS} from "store/game/types";
import {initState, reducer, GameStoreContext} from "store/game";
import startRound from "store/game/actions/start-round";
import computeResults from "store/game/actions/compute-results";

import classnames from "classnames";

import Loading from "components/commons/loading";
import Play from "components/game/play";
import Results from "components/game/results";

const {Provider: GameStoreContextProvider}=GameStoreContext;

const GameContainer = () => {
    // TODO: inject game options
    const [state, dispatch] = useThunkedReducer(reducer, null, initState);

    const handleFinishRound = useCallback((position) => {
        dispatch(computeResults(position, state))
    }, [state]);

    const handleNextRound=useCallback(()=>{
        console.log("handleNextRound()")
    },[]);

    // launch match
    useEffect(() => {
        dispatch(startRound(1));
    }, []);

    useEffect(() => {
        const html = document.querySelector("html");

        html.classList.add("game-page");

        return () => html.classList.remove("game-page");
    }, []);

    if (state.step===STEP_RESULTS) {
        return (
            <GameStoreContextProvider value={state}>
                <Results onNext={handleNextRound} />
            </GameStoreContextProvider>
        )
    }

    if (state.step === STEP_PLAY) {
        return (
            <GameStoreContextProvider value={state}>
                <Play onFinishRound={handleFinishRound} />;
            </GameStoreContextProvider>
        )
    }

    // state === STEP_LOADING
    return (
        <section className={"section"}>
            <div className={classnames("container", "has-text-centered")}>
                <Loading variant={"info"} size={"large"} />
            </div>
        </section>
    );
};

GameContainer.propTypes = {};

export default GameContainer;
