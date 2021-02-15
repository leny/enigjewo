/* leny/enigjewo
 *
 * /src/core/hooks/use-gmap-api-loader.js - Hook: useGMapAPILoader
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import {useState} from "react";
import {Loader} from "@googlemaps/js-api-loader";

import {GMAP_API_KEY} from "core/constants";

export const useGMapAPILoader = (options = {}) => {
    const [ready, setReady] = useState(false);

    const loader = new Loader({
        apiKey: GMAP_API_KEY,
        version: "weekly",
        libraries: ["geometry"],
        ...options,
    });

    !ready && loader.load().then(() => setReady(true));

    return [!ready, ready]; // loading, ready
};
