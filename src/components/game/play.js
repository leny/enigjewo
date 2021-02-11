/* leny/enigjewo
 *
 * /src/components/game/play.js - Game Component: play
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import "styles/game/play.scss";

import {useCallback, useContext, useEffect, useState, useRef} from "react";
import {GameStoreContext} from "store/game";

import PropTypes from "prop-types";

import sendPlayerRoundStartTime from "store/game/actions/send-player-round-start-time";

import StreetView from "components/commons/street-view";
import Roadmap from "components/game/roadmap";
import TopBar from "components/game/top-bar";

const Play = ({onFinishRound}) => {
    const {
        dispatch,
        code,
        currentRound: {index},
        settings: {isMulti},
        rounds,
        player,
    } = useContext(GameStoreContext);
    const {panorama} = rounds[`rnd-${index}`];
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

    useEffect(() => {
        isMulti && dispatch(sendPlayerRoundStartTime({code, index, player}));
    }, []);

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
