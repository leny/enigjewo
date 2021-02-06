/* leny/enigjewo
 *
 * /src/core/maps.js - Maps utils
 *
 * coded by leny@BeCode
 * started at 04/02/2021
 */

import axios from "axios";

import europe from "url:../data/maps/europe.geojson";
import belgium from "url:../data/maps/belgium.geojson";
import france from "url:../data/maps/france.geojson";

export const maps = {
    world: {
        label: "🌍 World (random)",
        data: null,
    },
    europe: {
        label: "🇪🇺 Europe (without Russia)",
        data: europe,
    },
    belgium: {
        label: "🇧🇪 Belgium",
        data: belgium,
    },
    france: {
        label: "🇫🇷 France",
        data: france,
    },
};

const cache = new Map();

export const loadGeoJSON = async map => {
    if (cache.has(map)) {
        return cache.get(map);
    }
    const {data: geoJSON} = await axios.get(maps[map].data, {
        responseType: "json",
    });
    cache.set(map, geoJSON);
    return geoJSON;
};
