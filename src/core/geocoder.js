/* leny/enigjewo
 *
 * /src/core/geocoder.js - Geocoder
 *
 * coded by leny
 * started at 06/02/2022
 */

/* global google */

export const getCountryFromPosition = async position => {
    const geocoder = new google.maps.Geocoder();

    const {results} = await geocoder.geocode({location: position});

    const result = results.find(res => {
        const {types} = res?.address_components[0] || [];
        return types[0] === "country" && types[1] === "political";
    });

    if (result) {
        return result.address_components[0].short_name;
    }

    return null;
};
