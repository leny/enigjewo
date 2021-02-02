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
import {useTimer} from "core/hooks/use-timer";

import {noop} from "core/utils";

import {DEFAULT_ROUND_DURATION, NBSP} from "core/constants";

const TopBar = ({
    roundDuration = DEFAULT_ROUND_DURATION,
    currentRound = 1,
    totalRounds = 5,
    score = 0,
    onTimerFinished = noop,
}) => {
    const [{seconds}] = useTimer(roundDuration, true, onTimerFinished);

    return (
        <div
            className={classnames(
                "top-bar",
                "is-dark",
                "notification",
                "is-flex",
                "is-flex-direction-row",
                "is-justify-content-space-between",
                "is-align-content-center",
            )}>
            <strong className={classnames("top-bar__timer")}>
                {String(Math.floor(seconds / 60)).padStart(2, "0")}
                <span className={classnames(seconds % 2 && "is-invisible")}>
                    {":"}
                </span>
                {String(seconds % 60).padStart(2, "0")}
            </strong>
            <span className={classnames("top-bar__rounds")}>
                <span className={classnames("has-text-grey")}>{"Round:"}</span>
                {NBSP}
                <strong>{`${currentRound} / ${totalRounds}`}</strong>
            </span>
            <span className={classnames("top-bar__score")}>
                <span className={classnames("has-text-grey")}>{"Score:"}</span>
                <strong>{score}</strong>
            </span>
        </div>
    );
};

TopBar.propTypes = {
    roundDuration: PropTypes.number,
    currentRound: PropTypes.number,
    totalRounds: PropTypes.number,
    score: PropTypes.number,
    onTimerFinished: PropTypes.func,
};

export default TopBar;
