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

import Panorama from "components/game/panorama";
import Roadmap from "components/game/roadmap";
import TopBar from "components/game/top-bar";

const GameContainer = () => {
    const handleResetPanorama=useCallback(()=>console.log("reset panorama"), []);

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

    return (
        <>
            <TopBar />
            <Panorama />
            <Roadmap onResetPanorama={handleResetPanorama} onGuessPosition={handleGuessPosition} />
        </>
    );
};

GameContainer.propTypes = {};

export default GameContainer;
