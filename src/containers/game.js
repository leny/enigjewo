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

import {STEP_PLAY} from "store/game/types";
import {initState, reducer} from "store/game";
import startRound from "store/game/actions/start-round";

import classnames from "classnames";

import Loading from "components/commons/loading";
import Play from "components/game/play";

import {getRandomLatLng} from "core/geo-utils";

const GameContainer = () => {
    // TODO: inject game options
    const [state, dispatch] = useThunkedReducer(reducer, null, initState);

    const handleFinishRound = useCallback((position) => {
        console.log("handleFinishRound(position):", position);
        // TODO computeResults(index, position)
    }, []);

    // launch match
    useEffect(() => {
        dispatch(startRound(1));
    }, []);

    useEffect(() => {
        const html = document.querySelector("html");

        html.classList.add("game-page");

        return () => html.classList.remove("game-page");
    }, []);

    if (state.step === STEP_PLAY) {
        return <Play panorama={state.currentRound.panorama} rounds={state.rounds} score={state.currentRound.score} onFinishRound={handleFinishRound} />;
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
