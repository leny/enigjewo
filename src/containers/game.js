/* leny/enigjewo
 *
 * /src/containers/game.js - Game Container
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

/* eslint-disable */ // WIP

import "styles/game.scss";

import {useEffect, useCallback, useState} from "react";
import {useStreetViewService} from "core/hooks/use-streetview-service";

import classnames from "classnames";

import Loading from "components/commons/loading";

import Panorama from "components/game/panorama";
import Roadmap from "components/game/roadmap";
import TopBar from "components/game/top-bar";

import {getRandomLatLng} from "core/geo-utils";

const GameContainer = () => {
    const [position, setPosition] = useState(null);
    const [panorama] = useStreetViewService();
    const [discriminator, setDiscriminator] = useState(Date.now());
    const handleResetPanorama = useCallback(
        () => setDiscriminator(Date.now()),
        [setDiscriminator],
    );

    const handleUpdatePosition = useCallback((pos) => setPosition(pos), [
        setPosition,
    ]);

    const handleFinishRound=useCallback(()=>{
        const pos = position||getRandomLatLng().position;
        console.log("finishRound(position):", pos);
        // TODO: extract match logic in sub component, then send position to GameContainer to conclude a round & show results
    },[position])

    useEffect(() => {
        const html = document.querySelector("html");

        html.classList.add("game-page");

        return () => html.classList.remove("game-page");
    }, []);

    if (!panorama) {
        return (
            <section className={"section"}>
                <div className={classnames("container", "has-text-centered")}>
                    <Loading variant={"info"} size={"large"} />
                </div>
            </section>
        );
    }

    return (
        <>
            <TopBar onTimerFinished={handleFinishRound} />
            <Panorama panorama={panorama} discriminator={discriminator} />
            <Roadmap
                onResetPanorama={handleResetPanorama}
                onUpdatePosition={handleUpdatePosition}
                onGuessPosition={handleFinishRound}
            />
        </>
    );
};

GameContainer.propTypes = {};

export default GameContainer;
