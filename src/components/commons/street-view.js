/* leny/enigjewo
 *
 * /src/components/commons/street-view.js - Common Component: Google StreetView
 *
 * coded by leny
 * started at 04/02/2021
 */

/* global google */
/* eslint-disable consistent-return */

import "styles/game.scss";

import {useRef, useEffect, forwardRef} from "react";
import useComponentSize from "@rehooks/component-size";

import classnames from "classnames";
import PropTypes from "prop-types";

const StreetView = forwardRef(
    ({className, panorama, stationary = false, options = {}}, streetView) => {
        const box = useRef(null);
        const {height} = useComponentSize(box);

        useEffect(() => {
            if (streetView.current || !box.current) {
                return;
            }

            streetView.current = new google.maps.StreetViewPanorama(
                box.current,
                stationary
                    ? {
                          disableDefaultUI: true,
                          clickToGo: false,
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
                      }
                    : {
                          addressControl: false,
                          clickToGo: true,
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

            if (stationary) {
                let startingPosition;

                const listener = streetView.current.addListener(
                    "position_changed",
                    () => {
                        if (!startingPosition) {
                            startingPosition = streetView.current.getPosition();
                        } else if (
                            !streetView.current
                                .getPosition()
                                .equals(startingPosition)
                        ) {
                            streetView.current.setPosition(startingPosition);
                            return false;
                        }
                    },
                );

                return () => {
                    google.maps.event.removeListener(listener);
                };
            }
        }, [box, streetView.current, panorama, stationary, options]);

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
    options: PropTypes.object,
    panorama: PropTypes.string.isRequired,
    stationary: PropTypes.bool,
};

export default StreetView;
