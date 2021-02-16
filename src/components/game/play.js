/* leny/enigjewo
 *
 * /src/components/game/play.js - Game Component: play
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import "styles/game/play.scss";

import classnames from "classnames";
import {useCallback, useContext, useEffect, useState, useRef} from "react";
import {useLocalStorage} from "react-use-storage";
import {GameStoreContext} from "store/game";

import PropTypes from "prop-types";

import sendPlayerRoundStartTime from "store/game/actions/send-player-round-start-time";

import StreetView from "components/commons/street-view";
import Roadmap from "components/game/roadmap";
import TopBar from "components/game/top-bar";

const SIZE_SMALL = "small";
const SIZE_MEDIUM = "medium";
const SIZE_BIG = "big";

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
    const [isDocked, setIsDocked] = useLocalStorage("play-ui-is-docked", false);
    const [size, setSize] = useLocalStorage("play-ui-size", SIZE_SMALL);
    const [isPinned, setIsPinned] = useLocalStorage("play-ui-is-pinned", false);
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

    const handleToggleDocked = useCallback(() => {
        setIsDocked(!isDocked);
    }, [setIsDocked, isDocked]);

    const handleTogglePinned = useCallback(() => setIsPinned(!isPinned), [
        setIsPinned,
        isPinned,
    ]);

    const handleGrowSize = useCallback(
        () =>
            setSize(
                {
                    [SIZE_SMALL]: SIZE_MEDIUM,
                    [SIZE_MEDIUM]: SIZE_BIG,
                    [SIZE_BIG]: SIZE_BIG,
                }[size],
            ),
        [setSize, size],
    );

    const handleShrinkSize = useCallback(
        () =>
            setSize(
                {
                    [SIZE_SMALL]: SIZE_SMALL,
                    [SIZE_MEDIUM]: SIZE_SMALL,
                    [SIZE_BIG]: SIZE_MEDIUM,
                }[size],
            ),
        [setSize, size],
    );

    useEffect(() => {
        const html = document.querySelector("html");

        html.classList.add("bust-scroll");

        return () => html.classList.remove("bust-scroll");
    }, []);

    useEffect(() => {
        isMulti && dispatch(sendPlayerRoundStartTime({code, index, player}));
    }, []);

    return (
        <div className={classnames("play", isDocked && "play--docked")}>
            <TopBar onTimerFinished={handleFinishRound} />
            <StreetView
                className={classnames(isDocked && "play__street-view")}
                panorama={panorama}
                ref={streetView}
            />
            <Roadmap
                className={classnames(isPinned && "play__roadmap")}
                isDocked={isDocked}
                isPinned={isPinned}
                size={size}
                onTogglePinned={handleTogglePinned}
                onToggleDocked={handleToggleDocked}
                onShrinkSize={handleShrinkSize}
                onGrowSize={handleGrowSize}
                onResetPanorama={handleResetPanorama}
                onUpdatePosition={handleUpdatePosition}
                onGuessPosition={handleFinishRound}
            />
        </div>
    );
};

Play.propTypes = {
    onFinishRound: PropTypes.func.isRequired,
};

export default Play;
