/* leny/enigjewo
 *
 * /src/components/game/play.js - Game Component: play
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import "styles/play.scss";

import {useCallback, useState} from "react";

import PropTypes from "prop-types";
import classnames from "classnames";

import Loading from "components/commons/loading";

import Panorama from "components/game/panorama";
import Roadmap from "components/game/roadmap";
import TopBar from "components/game/top-bar";

import {getRandomLatLng} from "core/geo-utils";

const Play = ({panorama, onFinishRound}) => {
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

    if (!panorama) {
        return (
            <section className={"section"}>
                <div className={classnames("container", "has-text-centered")}>
                    <Loading variant={"info"} size={"large"} />
                </div>
            </section>
        );
    }

    return (
        <>
            <TopBar onTimerFinished={handleFinishRound} />
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
    panorama: PropTypes.string.isRequired,
    // TODO: game options
    onFinishRound: PropTypes.func.isRequired,
};

export default Play;
