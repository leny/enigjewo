/* leny/enigjewo
 *
 * /src/core/geo-utils.js - Core Geo Utils
 *
 * coded by leny@BeCode
 * started at 02/02/2021
 */

import {point} from "@turf/helpers";
import distance from "@turf/distance";
import bbox from "@turf/bbox";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import randomPositionInPolygon from "random-position-in-polygon";

export const getMaxDistanceBbox = box => {
    const bboxPlace = Object.values(box);
    const from = point(bboxPlace.slice(0, 2));
    const to = point(bboxPlace.slice(2, 4));

    return distance(from, to);
};

export const getGeoJSONDifficulty = geoJSON =>
    getMaxDistanceBbox(bbox(geoJSON)) / 10;

export const getRandomLatLng = geoJSON => {
    if (!geoJSON) {
        return {
            position: {
                lat: Math.random() * 170 - 85,
                lng: Math.random() * 360 - 180,
            },
        };
    }

    let position,
        radius = 100000;

    if (geoJSON.type === "FeatureCollection") {
        const feature =
            geoJSON.features[
                Math.floor(Math.random() * geoJSON.features.length)
            ];

        if (feature.geometry.type === "point") {
            position = feature.geometry.coordinates;
            radius = 50;
        } else {
            radius = getMaxDistanceBbox(bbox(feature)) * 100;
            position = randomPositionInPolygon(feature);
        }
    } else {
        radius = getMaxDistanceBbox(bbox(geoJSON)) * 100;
        position = randomPositionInPolygon(geoJSON);
    }

    return {
        radius,
        position: {lat: position[1], lng: position[0]},
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
