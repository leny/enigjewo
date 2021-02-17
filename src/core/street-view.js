/* leny/enigjewo
 *
 * /src/core/street-view.js - StreetView
 *
 * coded by leny@BeCode
 * started at 03/02/2021
 */

/* global google */

import {DEBUG} from "core/constants";
import {point} from "@turf/helpers";
import {getRandomLatLng, isInGeoJSON} from "core/geo-utils";

let service;

export const getRandomPanorama = (geoJSON, progress) =>
    new Promise(resolve => {
        let getPanorama,
            progressCount = 0;

        (getPanorama = () => {
            (service ||= new google.maps.StreetViewService()).getPanorama(
                {
                    location: getRandomLatLng(geoJSON).position,
                    radius: 100000,
                    preference: "nearest",
                    source: "outdoor",
                },
                (data, status) => {
                    progress?.(++progressCount);

                    if (status !== "OK" || !data?.location) {
                        getPanorama();
                        return;
                    }

                    if (
                        geoJSON &&
                        !isInGeoJSON(
                            point([
                                data.location.latLng.lng(),
                                data.location.latLng.lat(),
                            ]),
                            geoJSON,
                        )
                    ) {
                        DEBUG &&
                            console.warn("DEBUG:isInGeoJSON returned false!");
                        // TODO: count attempts & throw error?
                        getPanorama();
                        return;
                    }

                    DEBUG &&
                        console.log("DEBUG:getRandomPanorama:", {
                            description: data.location.description,
                            panorama: data.location.pano,
                            position: data.location.latLng.toJSON(),
                        });

                    resolve({
                        panorama: data.location.pano,
                        position: data.location.latLng.toJSON(),
                    });
                },
            );
        })();
    });
