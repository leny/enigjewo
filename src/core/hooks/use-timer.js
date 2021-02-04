/* leny/enigjewo
 *
 * /src/core/hooks/use-timer.js - Custom hook: useTimer
 *
 * coded by leny@BeCode
 * started at 02/02/2021
 */

import {useState, useEffect} from "react";
import {noop} from "core/utils";
import useInterval from "use-interval";

export const useTimer = (
    initialSeconds,
    initialRunning = false,
    onFinished = noop,
) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [running, setRunning] = useState(initialRunning);

    useInterval(() => running && setSeconds(Math.max(0, seconds - 1)), 1000);

    useEffect(() => {
        if (seconds === 0) {
            setRunning(false);
            onFinished();
        }
    }, [seconds, setRunning, onFinished]);

    return [
        {seconds, running},
        {setSeconds, setRunning},
    ];
};
