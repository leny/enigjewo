/* leny/enigjewo
 *
 * /src/containers/game.js - Game Container
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import "styles/game.scss";

import {useRef, useEffect} from "react";

import Panorama from "components/game/panorama";
import Roadmap from "components/game/roadmap";

const GameContainer = () => {

    useEffect(() => {
        const html = document.querySelector("html");

        html.classList.add("game-page");

        return () => html.classList.remove("game-page");
    }, []);

    return (
        <>
            <div>{"top-bar"}</div>
            <Panorama />
            <div>{"tools"}</div>
        </>
    );
};

GameContainer.propTypes = {};

export default GameContainer;
