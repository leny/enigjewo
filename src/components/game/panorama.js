/* leny/enigjewo
 *
 * /src/components/game/panorama.js - Game Component: panorama (street-view)
 *
 * coded by leny@BeCode
 * started at 02/02/2021
 */

/* eslint-disable */ // WIP

import "styles/game/panorama.scss";

import {useRef} from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const Panorama = () => {
    const box = useRef(null);

    return <div className={classnames("panorama")} ref={box} />;
};

Panorama.propTypes = {};

export default Panorama;
