/* leny/enigjewo
 *
 * /src/components/game/play.js - Game Component: play
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import "styles/game/play.scss";

import {useCallback, useState} from "react";

import PropTypes from "prop-types";

import Panorama from "components/game/panorama";
import Roadmap from "components/game/roadmap";
import TopBar from "components/game/top-bar";

import {getRandomLatLng} from "core/geo-utils";

const Play = ({onFinishRound}) => {
    const [position, setPosition] = useState(null);
    const [discriminator, setDiscriminator] = useState(Date.now());
    const handleResetPanorama = useCallback(
        () => setDiscriminator(Date.now()),
        [setDiscriminator],
    );

    const handleUpdatePosition = useCallback(pos => setPosition(pos), [
        setPosition,
    ]);

    const handleFinishRound = useCallback(
        () => onFinishRound(position || getRandomLatLng().position),
        [position, onFinishRound],
    );

    return (
        <>
            <TopBar onTimerFinished={handleFinishRound} />
            <Panorama discriminator={discriminator} />
            <Roadmap
                onResetPanorama={handleResetPanorama}
                onUpdatePosition={handleUpdatePosition}
                onGuessPosition={handleFinishRound}
            />
        </>
    );
};

Play.propTypes = {
    onFinishRound: PropTypes.func.isRequired,
};

export default Play;
