/* leny/enigjewo
 *
 * /src/components/game/panorama.js - Game Component: panorama (street-view)
 *
 * coded by leny@BeCode
 * started at 02/02/2021
 */

import "styles/game/panorama.scss";

import PropTypes from "prop-types";

import {useContext} from "react";
import {GameStoreContext} from "store/game";

import StreetView from "components/commons/street-view";

const Panorama = ({discriminator}) => {
    const {
        currentRound: {panorama},
    } = useContext(GameStoreContext);

    return <StreetView panorama={panorama} discriminator={discriminator} />;
};

Panorama.propTypes = {
    discriminator: PropTypes.number.isRequired,
};

export default Panorama;
