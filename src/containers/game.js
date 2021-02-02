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
    const [panorama]=useStreetViewService();
    const [discriminator, setDiscriminator]=useState(Date.now());
    const handleResetPanorama=useCallback(()=>setDiscriminator(Date.now()), [setDiscriminator]);

    console.log("panorama:", panorama);

    const handleGuessPosition = useCallback(
        position => {
            // TODO: if no position, compute one randomly
            console.log("guess position:", position);
        },
        [],
    );

    useEffect(() => {
        const html = document.querySelector("html");

        html.classList.add("game-page");

        return () => html.classList.remove("game-page");
    }, []);

    if (!panorama){
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
            <TopBar />
            <Panorama panorama={panorama} discriminator={discriminator} />
            <Roadmap onResetPanorama={handleResetPanorama} onGuessPosition={handleGuessPosition} />
        </>
    );
};

GameContainer.propTypes = {};

export default GameContainer;
