/* leny/enigjewo
 *
 * /src/components/commons/map.js - Common Component: Map
 *
 * coded by leny@BeCode
 * started at 04/02/2021
 */

/* global google */

import {useRef, useEffect, useState} from "react";
import PropTypes from "prop-types";

import {noop} from "core/utils";

const GMap = ({
    className,
    position = {lat: 0, lng: 0},
    zoom = 2,
    discriminator = 0,
    options = {},
    onMapReady = noop,
    onMapClick = noop,
}) => {
    const box = useRef(null);
    const [map, setMap] = useState(null);

    useEffect(() => {
        if (map || !box.current) {
            return;
        }

        const gmap = new google.maps.Map(box.current, {
            center: position,
            zoom,
            disableDefaultUI: true,
            zoomControl: true,
            ...options,
        });

        onMapReady(gmap);
        gmap.addListener("click", e => onMapClick(gmap, e));

        setMap(gmap);
    }, [box, options, map, setMap, position, zoom, onMapReady, onMapClick]);

    useEffect(() => {
        if (!map) {
            return;
        }

        google.maps.event.clearListeners(map, "click");
        map.addListener("click", e => onMapClick(map, e));
    }, [map, onMapClick]);

    useEffect(() => {
        map?.setZoom(zoom);
    }, [map, zoom]);

    useEffect(() => {
        map?.panTo(position);
    }, [map, position, discriminator]);

    return <div className={className} ref={box} />;
};

GMap.propTypes = {
    position: PropTypes.object.isRequired,
    zoom: PropTypes.number,
    discriminator: PropTypes.number,
    options: PropTypes.object,
    onMapReady: PropTypes.func,
    onMapClick: PropTypes.func,
};

export default GMap;
