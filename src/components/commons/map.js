/* leny/enigjewo
 *
 * /src/components/commons/map.js - Common Component: Map
 *
 * coded by leny@BeCode
 * started at 04/02/2021
 */

/* global google */

import {useRef, useEffect, forwardRef} from "react";
import PropTypes from "prop-types";

import {noop} from "core/utils";

const GMap = forwardRef(
    (
        {
            className,
            position = {lat: 0, lng: 0},
            zoom = 2,
            options = {},
            onMapReady = noop,
            onMapClick = noop,
        },
        map,
    ) => {
        const box = useRef(null);

        useEffect(() => {
            if (map.current || !box.current) {
                return;
            }

            map.current = new google.maps.Map(box.current, {
                center: position,
                zoom,
                disableDefaultUI: true,
                zoomControl: true,
                ...options,
            });

            // onMapReady(map.current);
            map.current.addListener("click", e => onMapClick(map.current, e));
        }, [box, options, map.current, position, zoom, onMapReady, onMapClick]);

        useEffect(() => {
            if (!map) {
                return;
            }

            google.maps.event.clearListeners(map.current, "click");
            map.current.addListener("click", e => onMapClick(map.current, e));
        }, [map.current, onMapClick]);

        return <div className={className} ref={box} />;
    },
);

GMap.propTypes = {
    position: PropTypes.object,
    zoom: PropTypes.number,
    options: PropTypes.object,
    onMapReady: PropTypes.func,
    onMapClick: PropTypes.func,
};

export default GMap;
