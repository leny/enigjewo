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

const Play = ({rounds, score, panorama, onFinishRound}) => {
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
            <TopBar
                rounds={rounds}
                score={score}
                onTimerFinished={handleFinishRound}
            />
            <Panorama panorama={panorama} discriminator={discriminator} />
            <Roadmap
                onResetPanorama={handleResetPanorama}
                onUpdatePosition={handleUpdatePosition}
                onGuessPosition={handleFinishRound}
            />
        </>
    );
};

Play.propTypes = {
    rounds: PropTypes.shape({
        duration: PropTypes.number.isRequired,
        current: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
    }).isRequired,
    score: PropTypes.number.isRequired,
    panorama: PropTypes.string.isRequired,
    // TODO: game options
    onFinishRound: PropTypes.func.isRequired,
};

export default Play;
