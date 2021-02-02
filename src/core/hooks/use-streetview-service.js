/* leny/enigjewo
 *
 * /src/core/hooks/use-streetview-service.js - Hook: useStreetViewService
 *
 * coded by leny@BeCode
 * started at 02/02/2021
 */

/* global google */

import {useState, useCallback, useEffect, useMemo} from "react";
import {getRandomLatLng} from "core/geo-utils";

export const useStreetViewService = (pano = null) => {
    const [panorama, setPanorama] = useState(pano);

    const service = useMemo(() => new google.maps.StreetViewService(), []);

    const getPanorama = useCallback(() => {
        service.getPanorama(
            {
                location: getRandomLatLng().position,
                radius: 100000,
                preference: "nearest",
                source: "outdoor",
            },
            (data, status) => {
                if (status !== "OK" || !data?.location) {
                    getPanorama();
                    return;
                }

                setPanorama(data.location.pano);
            },
        );
    }, [setPanorama, service]);

    useEffect(() => {
        !pano && getPanorama();
    }, [pano]);

    return [panorama, getPanorama];
};
