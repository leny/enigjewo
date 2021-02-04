/* leny/enigjewo
 *
 * /src/components/commons/street-view.js - Common Component: Google StreetView
 *
 * coded by leny@BeCode
 * started at 04/02/2021
 */

/* global google */

import "styles/game.scss";

import {useRef, useState, useEffect} from "react";

import classnames from "classnames";
import PropTypes from "prop-types";

const StreetView = ({className, panorama, discriminator = 0, options = {}}) => {
    const box = useRef(null);
    const [streetView, setStreetView] = useState(null);

    useEffect(() => {
        if (streetView || !box.current) {
            return;
        }

        setStreetView(
            new google.maps.StreetViewPanorama(box.current, {
                addressControl: false,
                fullscreenControl: false,
                motionTracking: false,
                motionTrackingControl: false,
                showRoadLabels: false,
                panControl: true,
                ...options,
            }),
        );
    }, [box, streetView, setStreetView, options]);

    useEffect(() => {
        if (!streetView || !panorama) {
            return;
        }

        streetView.setPano(panorama);
        streetView.setPov({
            heading: 270,
            pitch: 0,
        });
        streetView.setZoom(0);
    }, [streetView, panorama, discriminator]);

    return <div className={classnames(className, "expand")} ref={box} />;
};

StreetView.propTypes = {
    panorama: PropTypes.string.isRequired,
    discriminator: PropTypes.number,
    options: PropTypes.object,
};

export default StreetView;
