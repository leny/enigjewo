/* leny/enigjewo
 *
 * /src/containers/game.js - Game Container
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import "styles/game.scss";

import {useRef} from "react";

import Roadmap from "components/game/roadmap";

const GameContainer = () => {
    const streetView = useRef(null);

    return (
        <div>
            <div>{"top-bar"}</div>
            <div ref={streetView}>{"street-view"}</div>
            <Roadmap />
            <div>{"tools"}</div>
        </div>
    );
};

GameContainer.propTypes = {};

export default GameContainer;
