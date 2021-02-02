/* leny/enigjewo
 *
 * /src/components/game/roadmap.js - Game Component: Roadmap
 *
 * coded by leny@BeCode
 * started at 02/02/2021
 */

/* global google */

import "styles/game.scss";

import {useRef, useEffect, useState} from "react";
import classnames from "classnames";

const Roadmap = () => {
    const [map, setMap] = useState(null);
    const box = useRef(null);

    useEffect(() => {
        if (map || !box.current) {
            return;
        }

        setMap(
            new google.maps.Map(box.current, {
                center: {lat: -34.397, lng: 150.644},
                zoom: 8,
                disableDefaultUI: true,
                zoomControl: true,
            }),
        );
    }, [box, map, setMap]);

    return <div ref={box} className={classnames("map-view")} />;
};

Roadmap.propTypes = {};

export default Roadmap;
