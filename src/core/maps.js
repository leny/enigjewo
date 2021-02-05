/* leny/enigjewo
 *
 * /src/core/maps.js - Maps utils
 *
 * coded by leny@BeCode
 * started at 04/02/2021
 */

import Europe from "url:../data/maps/europe.geojson";

export const maps = {
    world: {
        label: "🌍 World (random)",
        data: null,
    },
    europe: {
        label: "🇪🇺 Europe (without Russia)",
        data: Europe,
    },
};
