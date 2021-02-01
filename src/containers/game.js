/* leny/enigjewo
 *
 * /src/containers/game.js - Game Container
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import "styles/game.scss";

import {useRef} from "react";
import classnames from "classnames";

const GameContainer = () => {
    const streetView = useRef(null);
    const mapView = useRef(null);

    return (
        <div>
            <div>{"top-bar"}</div>
            <div ref={streetView}>{"street-view"}</div>
            <div ref={mapView} className={classnames("map-view")} />
            <div>{"tools"}</div>
        </div>
    );
};

GameContainer.propTypes = {};

export default GameContainer;
