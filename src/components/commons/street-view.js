/* leny/enigjewo
 *
 * /src/components/commons/street-view.js - Common Component: Google StreetView
 *
 * coded by leny@BeCode
 * started at 04/02/2021
 */

/* global google */

import "styles/game.scss";

import {useRef, useEffect, forwardRef} from "react";
import useComponentSize from "@rehooks/component-size";

import classnames from "classnames";
import PropTypes from "prop-types";

const StreetView = forwardRef(
    ({className, panorama, options = {}}, streetView) => {
        const box = useRef(null);
        const {height} = useComponentSize(box);

        useEffect(() => {
            if (streetView.current || !box.current) {
                return;
            }

            streetView.current = new google.maps.StreetViewPanorama(
                box.current,
                {
                    addressControl: false,
                    fullscreenControl: false,
                    motionTracking: false,
                    motionTrackingControl: false,
                    showRoadLabels: false,
                    panControl: true,
                    panControlOptions: {
                        position: google.maps.ControlPosition.RIGHT_TOP,
                    },
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.RIGHT_TOP,
                    },
                    ...options,
                },
            );

            streetView.current.setPano(panorama);
            streetView.current.setPov({
                heading: 270,
                pitch: 0,
            });
            streetView.current.setZoom(0);
        }, [box, streetView.current, panorama, options]);

        useEffect(
            () =>
                streetView.current &&
                google.maps.event.trigger(streetView.current, "resize"),
            [streetView.current, height],
        );

        return <div className={classnames(className, "expand")} ref={box} />;
    },
);

StreetView.propTypes = {
    panorama: PropTypes.string.isRequired,
    options: PropTypes.object,
};

export default StreetView;
