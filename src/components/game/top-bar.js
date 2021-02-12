/* leny/enigjewo
 *
 * /src/components/game/top-bar.js - Game TopBar
 *
 * coded by leny@BeCode
 * started at 02/02/2021
 */

import "styles/game/top-bar.scss";

import classnames from "classnames";
import PropTypes from "prop-types";
import {useEffect, useState, useContext} from "react";
import {useLocalStorage} from "react-use-storage";
import {useTimer} from "core/hooks/use-timer";
import useSound from "use-sound";

import {GameStoreContext} from "store/game";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell, faBellSlash} from "@fortawesome/free-solid-svg-icons";

import {noop, preventDefault} from "core/utils";

import {NBSP} from "core/constants";

import halfTimeAlert from "url:sounds/half-time.ogg";
import lastSecondsAlert from "url:sounds/last-seconds.ogg";

const TopBar = ({onTimerFinished = noop}) => {
    const {
        settings: {duration, rounds: total},
        currentRound: {index: current},
        players,
        player,
    } = useContext(GameStoreContext);
    const {score} = players[player];
    const [withSoundAlerts, setWithSoundAlerts] = useLocalStorage(
        "topbar-ui-sound-alerts",
        true,
    );
    const [timerColorClassName, setTimerColorClassName] = useState(false);
    const [{seconds, running}] = useTimer(
        duration,
        duration !== false,
        onTimerFinished,
    );
    const [playHalfTimeAlert] = useSound(halfTimeAlert);
    const [playThirtySecondsRemainingAlert] = useSound(lastSecondsAlert);

    useEffect(() => {
        if (!running) {
            return;
        }

        if (seconds === duration) {
            setTimerColorClassName(false);
        }

        if (seconds === ~~(duration / 2)) {
            withSoundAlerts && playHalfTimeAlert();
            setTimerColorClassName("has-text-warning");
        }

        if (seconds === ~~(duration / 10)) {
            withSoundAlerts && playThirtySecondsRemainingAlert();
            setTimerColorClassName("has-text-danger");
        }
    }, [
        seconds,
        running,
        duration,
        withSoundAlerts,
        playHalfTimeAlert,
        playThirtySecondsRemainingAlert,
        setTimerColorClassName,
    ]);

    return (
        <div
            className={classnames(
                "top-bar",
                "is-dark",
                "notification",
                "is-flex",
                "is-flex-direction-row",
                "is-justify-content-space-between",
                "is-align-items-center",
            )}>
            <span
                className={classnames(
                    "is-flex",
                    "is-flex-direction-row",
                    "is-justify-content-flex-start",
                    "is-align-items-center",
                )}>
                {duration !== false && (
                    <a
                        href={"#"}
                        onClick={preventDefault(() =>
                            setWithSoundAlerts(!withSoundAlerts),
                        )}
                        className={classnames(
                            "icon",
                            !withSoundAlerts && "has-text-grey",
                        )}
                        title={
                            withSoundAlerts ? "Disable alerts" : "Enable alerts"
                        }>
                        <FontAwesomeIcon
                            icon={withSoundAlerts ? faBell : faBellSlash}
                        />
                    </a>
                )}
                {duration !== false ? (
                    <strong className={classnames(timerColorClassName)}>
                        {String(Math.floor(seconds / 60)).padStart(2, "0")}
                        <span
                            className={classnames(
                                seconds % 2 && "has-text-grey",
                            )}>
                            {":"}
                        </span>
                        {String(seconds % 60).padStart(2, "0")}
                    </strong>
                ) : (
                    NBSP
                )}
            </span>
            <span className={classnames("top-bar__rounds")}>
                <span className={classnames("has-text-grey")}>{"Round:"}</span>
                {NBSP}
                <strong>{`${current} / ${total}`}</strong>
            </span>
            <span className={classnames("top-bar__score")}>
                <span className={classnames("has-text-grey")}>{"Score:"}</span>
                {NBSP}
                <strong>{score}</strong>
                {NBSP}
                <small>{`pt${score > 0 ? "s" : ""}`}</small>
            </span>
        </div>
    );
};

TopBar.propTypes = {
    onTimerFinished: PropTypes.func,
};

export default TopBar;
