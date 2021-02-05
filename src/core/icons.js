/* leny/enigjewo
 *
 * /src/core/icons.js - Icon utils
 *
 * coded by leny@BeCode
 * started at 04/02/2021
 */

/* global google */

import CorrectPositionIcon from "url:../assets/icons/correct-position.png";
import Player1Icon from "url:../assets/icons/player-1.png";

const icons = {
    target: CorrectPositionIcon,
    player1: Player1Icon,
};

export const getMarkerIcon = icon => ({
    url: icons[icon],
    size: new google.maps.Size(24, 24),
    scaledSize: new google.maps.Size(24, 24),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(12, 12),
});
