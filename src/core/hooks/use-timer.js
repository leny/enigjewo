/* leny/enigjewo
 *
 * /src/core/hooks/use-timer.js - Custom hook: useTimer
 *
 * coded by leny@BeCode
 * started at 02/02/2021
 */

import {useState, useEffect} from "react";
import {noop} from "core/utils";

export const useTimer = (
    initialSeconds,
    initialRunning = false,
    onFinished = noop,
) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [running, setRunning] = useState(initialRunning);
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        if (running) {
            setIntervalId(
                setInterval(() => setSeconds(Math.max(0, seconds - 1)), 1000),
            );

            if (seconds === 0) {
                setRunning(false);
                onFinished();
            }
        } else if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }

        return () => {
            intervalId && clearInterval(intervalId);
        };
    }, [running, seconds]);

    return [
        {seconds, running},
        {setSeconds, setRunning},
    ];
};
