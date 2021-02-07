/* leny/enigjewo
 *
 * /src/components/game/play.js - Game Component: play
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import "styles/game/play.scss";

import {useCallback, useContext, useState, useRef} from "react";
import {GameStoreContext} from "store/game";

import PropTypes from "prop-types";

import StreetView from "components/commons/street-view";
import Roadmap from "components/game/roadmap";
import TopBar from "components/game/top-bar";

const Play = ({onFinishRound}) => {
    const {
        currentRound: {panorama},
    } = useContext(GameStoreContext);
    const [position, setPosition] = useState(null);
    const streetView = useRef(null);
    const handleResetPanorama = useCallback(() => {
        if (!streetView.current) {
            return;
        }

        streetView.current.setPano(panorama);
        streetView.current.setPov({
            heading: 270,
            pitch: 0,
        });
        streetView.current.setZoom(0);
    }, [streetView.current, panorama]);

    const handleUpdatePosition = useCallback(pos => setPosition(pos), [
        setPosition,
    ]);

    const handleFinishRound = useCallback(() => onFinishRound(position), [
        position,
        onFinishRound,
    ]);

    return (
        <>
            <TopBar onTimerFinished={handleFinishRound} />
            <StreetView panorama={panorama} ref={streetView} />
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
