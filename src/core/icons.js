/* leny/enigjewo
 *
 * /src/core/icons.js - Icon utils
 *
 * coded by leny@BeCode
 * started at 04/02/2021
 */

/* global google */

import CorrectPositionIcon from "url:../assets/icons/correct-position.png";
import BlackPlayerIcon from "url:../assets/icons/player-black.png";
import BluePlayerIcon from "url:../assets/icons/player-blue.png";
import CyanPlayerIcon from "url:../assets/icons/player-cyan.png";
import GreenPlayerIcon from "url:../assets/icons/player-green.png";
import LimePlayerIcon from "url:../assets/icons/player-lime.png";
import MaroonPlayerIcon from "url:../assets/icons/player-maroon.png";
import NavyPlayerIcon from "url:../assets/icons/player-navy.png";
import OrangePlayerIcon from "url:../assets/icons/player-orange.png";
import PinkPlayerIcon from "url:../assets/icons/player-pink.png";
import PurplePlayerIcon from "url:../assets/icons/player-purple.png";
import RedPlayerIcon from "url:../assets/icons/player-red.png";
import TealPlayerIcon from "url:../assets/icons/player-teal.png";
import TurquoisePlayerIcon from "url:../assets/icons/player-turquoise.png";
import VioletPlayerIcon from "url:../assets/icons/player-violet.png";
import WhitePlayerIcon from "url:../assets/icons/player-white.png";
import YellowPlayerIcon from "url:../assets/icons/player-yellow.png";

export const playerColors = [
    "black",
    "blue",
    "cyan",
    "green",
    "lime",
    "maroon",
    "navy",
    "orange",
    "pink",
    "purple",
    "red",
    "teal",
    "turquoise",
    "violet",
    "white",
    "yellow",
];

export const getRandomPlayerColor = () =>
    playerColors[~~(Math.random() * playerColors.length)];

const icons = {
    target: CorrectPositionIcon,
    black: BlackPlayerIcon,
    blue: BluePlayerIcon,
    cyan: CyanPlayerIcon,
    green: GreenPlayerIcon,
    lime: LimePlayerIcon,
    maroon: MaroonPlayerIcon,
    navy: NavyPlayerIcon,
    orange: OrangePlayerIcon,
    pink: PinkPlayerIcon,
    purple: PurplePlayerIcon,
    red: RedPlayerIcon,
    teal: TealPlayerIcon,
    turquoise: TurquoisePlayerIcon,
    violet: VioletPlayerIcon,
    white: WhitePlayerIcon,
    yellow: YellowPlayerIcon,
};

export const getMarkerIcon = icon => ({
    url: icons[icon],
    size: new google.maps.Size(24, 24),
    scaledSize: new google.maps.Size(24, 24),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(12, 12),
});
