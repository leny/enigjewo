/* leny/enigjewo
 *
 * /src/core/geo-utils.js - Core Geo Utils
 *
 * coded by leny@BeCode
 * started at 02/02/2021
 */

export const getRandomLatLng = () => ({
    position: {
        lat: Math.random() * 170 - 85,
        lng: Math.random() * 360 - 180,
    },
});
