/* leny/enigjewo
 *
 * /src/containers/game.js - Game Container
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import "styles/game.scss";

import {useRef} from "react";

import Panorama from "components/game/panorama";
import Roadmap from "components/game/roadmap";

const GameContainer = () => {
    const streetView = useRef(null);

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
