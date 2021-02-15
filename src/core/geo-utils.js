/* leny/enigjewo
 *
 * /src/core/geo-utils.js - Core Geo Utils
 *
 * coded by leny@BeCode
 * started at 02/02/2021
 */

/* global google */

import {DEBUG} from "core/constants";
import {point} from "@turf/helpers";
import distance from "@turf/distance";
import bbox from "@turf/bbox";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import {random} from "core/utils";

export const getMaxDistanceBbox = box => {
    const bboxPlace = Object.values(box);
    const from = point(bboxPlace.slice(0, 2));
    const to = point(bboxPlace.slice(2, 4));

    return distance(from, to);
};

export const getGeoJSONDifficulty = geoJSON =>
    getMaxDistanceBbox(bbox(geoJSON)) / 10;

export const getRandomLatLngInBbox = ([a, x, b, y]) => ({
    lng: random() * (b - a) + a,
    lat: random() * (y - x) + x,
});

export const getRandomLatLng = geoJSON => {
    if (!geoJSON) {
        const position = {
            lat: random() * 170 - 85,
            lng: random() * 360 - 180,
        };

        DEBUG && console.log("DEBUG:getRandomLatLng:", position);

        return {
            position,
        };
    }

    let position,
        radius = 100000;

    if (geoJSON.type === "FeatureCollection") {
        const feature =
            geoJSON.features[Math.floor(random() * geoJSON.features.length)];

        if (feature.geometry.type === "point") {
            position = feature.geometry.coordinates;
            radius = 50;
        } else {
            const box = bbox(feature);
            radius = getMaxDistanceBbox(box) * 100;
            position = getRandomLatLngInBbox(box);
        }
    } else {
        const box = bbox(geoJSON);
        radius = getMaxDistanceBbox(box) * 100;
        position = getRandomLatLngInBbox(box);
    }

    DEBUG && console.log("DEBUG:getRandomLatLng:", position);

    return {
        radius,
        position,
    };
};

export const isGeoJSONValid = ({type, features}) => {
    if (type === "FeatureCollection" && features) {
        return !features.some(
            ({geometry: {type: geometryType}}) =>
                !["Point", "Polygon", "MultiPolygon"].includes(geometryType),
        );
    }
    return false;
};

export const isInGeoJSON = (pnt, geoJSON) => {
    if (geoJSON.type === "Feature") {
        return geoJSON.geometry.type === "Point"
            ? distance(geoJSON, pnt, {units: "kilometers"}) < 0.05
            : booleanPointInPolygon(pnt, geoJSON);
    }
    return geoJSON.features.some(feature => {
        if (feature.geometry.type === "Point") {
            return distance(feature, pnt, {units: "kilometers"}) < 0.05;
        }
        return booleanPointInPolygon(pnt, feature);
    });
};

export const computeDistanceBetween = (from, to) =>
    google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(from),
        new google.maps.LatLng(to),
    );
