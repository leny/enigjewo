/* leny/enigjewo
 *
 * /src/components/game/summary.js - Game Component: summary
 *
 * coded by leny@BeCode
 * started at 04/02/2021
 */

/* global google */

import "styles/game/summary.scss";

import classnames from "classnames";
import PropTypes from "prop-types";
import {useContext, useEffect, useRef} from "react";
import {renderToStaticMarkup} from "react-dom/server";

import {GameStoreContext} from "store/game";
import {NBSP} from "core/constants";
import {getMarkerIcon} from "core/icons";
import {readableDuration, readableDistance, indexedArray} from "core/utils";
import {maps} from "core/maps";
import dayjs from "dayjs";

import Button from "components/commons/button";
import GMap from "components/commons/map";
import sendEndGameState from "store/game/actions/send-end-game-state";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCrown} from "@fortawesome/free-solid-svg-icons";

const Summary = ({onRestart}) => {
    const {
        dispatch,
        code,
        title,
        settings: {rounds: total, isMulti, map},
        rounds,
        entries,
        player,
        players,
        injected,
        startedAt: gameStartedAt,
    } = useContext(GameStoreContext);
    const gmap = useRef(null);

    useEffect(() => {
        if (isMulti && players[player].isOwner) {
            dispatch(sendEndGameState({code}));
        }
    }, []);

    useEffect(() => {
        if (!gmap.current) {
            return;
        }

        const bounds = new google.maps.LatLngBounds();
        gmap.current.setZoom(18);
        indexedArray(total).forEach(i => {
            const {target} = rounds[`rnd-${i}`];
            if (isMulti) {
                const bestScore = Math.max(
                    ...Object.entries(entries)
                        .filter(([key]) => key.startsWith(`rnd-${i}`))
                        .map(([, {score}]) => score),
                );

                Object.entries(players).forEach(([key, {icon, name}]) => {
                    const {position, distance, score} =
                        entries[`rnd-${i}-${key}`] || {};

                    if (!position) {
                        return;
                    }

                    const polyLine = new google.maps.Polyline({
                        path: [target, position],
                        strokeColor:
                            score === bestScore
                                ? "hsl(141, 53%, 53%)"
                                : "hsl(48, 100%, 29%)",
                        strokeOpacity: 1.0,
                        strokeWeight: 3,
                    });
                    polyLine.setMap(gmap.current);
                    const positionInfoWindow = new google.maps.InfoWindow({
                        content: renderToStaticMarkup(
                            <>
                                <h5 className={"mb-1"}>
                                    {`Round #${i}: ${name}`}
                                </h5>
                                <p>
                                    {distance > 2000
                                        ? `${Math.floor(distance / 1000)}km`
                                        : `${distance}m`}
                                    {`${NBSP}-${NBSP}`}
                                    <strong
                                        className={classnames(
                                            score === 5000 &&
                                                "has-text-success",
                                        )}>
                                        {`${score}pts`}
                                    </strong>
                                </p>
                                <p>
                                    <small>
                                        {`${position.lat.toFixed(
                                            4,
                                        )}, ${position.lng.toFixed(4)}`}
                                    </small>
                                </p>
                            </>,
                        ),
                    });
                    const positionMarker = new google.maps.Marker({
                        position,
                        map: gmap.current,
                        icon: getMarkerIcon(icon),
                    });
                    positionMarker.addListener("click", () =>
                        positionInfoWindow.open(gmap.current, positionMarker),
                    );
                    bounds.extend(positionMarker.getPosition());
                });
            } else {
                const {position, distance, score} = entries[
                    `rnd-${i}-${player}`
                ];
                const {icon} = players[player];

                const polyLine = new google.maps.Polyline({
                    path: [target, position],
                    strokeColor: "hsl(141, 53%, 53%)",
                    strokeOpacity: 1.0,
                    strokeWeight: 3,
                });
                polyLine.setMap(gmap.current);
                const positionInfoWindow = new google.maps.InfoWindow({
                    content: renderToStaticMarkup(
                        <>
                            <h5 className={"mb-1"}>
                                {`Round #${i}: Your guess`}
                            </h5>
                            <p>
                                {readableDistance(distance)}
                                {`${NBSP}-${NBSP}`}
                                <strong
                                    className={classnames(
                                        score === 5000 && "has-text-success",
                                    )}>
                                    {`${score}pts`}
                                </strong>
                            </p>
                            <p>
                                <small>
                                    {`${position.lat.toFixed(
                                        4,
                                    )}, ${position.lng.toFixed(4)}`}
                                </small>
                            </p>
                        </>,
                    ),
                });
                const positionMarker = new google.maps.Marker({
                    position,
                    map: gmap.current,
                    icon: getMarkerIcon(icon),
                });
                positionMarker.addListener("click", () =>
                    positionInfoWindow.open(gmap.current, positionMarker),
                );
                bounds.extend(positionMarker.getPosition());
            }

            const targetInfoWindow = new google.maps.InfoWindow({
                content: renderToStaticMarkup(
                    <>
                        <h5 className={"mb-1"}>{`Round #${i}: Target`}</h5>
                        <p>
                            {`${target.lat.toFixed(4)}, ${target.lng.toFixed(
                                4,
                            )}`}
                        </p>
                    </>,
                ),
            });
            const targetMarker = new google.maps.Marker({
                position: target,
                map: gmap.current,
                icon: getMarkerIcon("target"),
            });
            targetMarker.addListener("click", () =>
                targetInfoWindow.open(gmap.current, targetMarker),
            );
            bounds.extend(targetMarker.getPosition());
        });
        gmap.current.fitBounds(bounds, {
            top: 30,
            right: 30,
            bottom: 30,
            left: 30,
        });
    }, [gmap.current, isMulti, entries, player, rounds, total]);

    const $gmap = <GMap className={classnames("summary__map")} ref={gmap} />;

    let $content = $gmap;

    if (isMulti) {
        const bestScore = Math.max(
            ...Object.values(players).map(({score}) => score),
        );

        $content = (
            <>
                <div className={classnames("column", "is-one-quarter")}>
                    <ol className={"pl-4"}>
                        {Object.entries(players)
                            .sort(
                                (a, b) => (b[1].score || 0) - (a[1].score || 0),
                            )
                            .map(
                                ([
                                    key,
                                    {
                                        score: totalScore = 0,
                                        name,
                                        icon,
                                        isActive,
                                    },
                                ]) => (
                                    <li
                                        key={key}
                                        className={classnames(
                                            !isActive && "has-text-grey-light",
                                        )}>
                                        <span className={"is-block"}>
                                            <img
                                                className={
                                                    "results__player-icon"
                                                }
                                                src={getMarkerIcon(icon).url}
                                            />
                                            {NBSP}
                                            <span
                                                className={classnames(
                                                    totalScore ===
                                                        bestScore && [
                                                        "has-text-success",
                                                        "has-text-weight-bold",
                                                    ],
                                                )}>
                                                {name}
                                                {totalScore === bestScore && (
                                                    <span
                                                        className={classnames(
                                                            "icon",
                                                            "is-small",
                                                        )}>
                                                        <FontAwesomeIcon
                                                            size={"xs"}
                                                            icon={faCrown}
                                                        />
                                                    </span>
                                                )}
                                            </span>
                                        </span>
                                        <small
                                            className={classnames(
                                                "is-block",
                                                "has-text-right",
                                            )}>
                                            {`${totalScore}pts`}
                                        </small>
                                    </li>
                                ),
                            )}
                    </ol>
                </div>
                <div className={classnames("column", "p-0")}>{$gmap}</div>
            </>
        );
    }

    return (
        <div className={classnames("columns", "is-centered")}>
            <div
                className={classnames(
                    "column",
                    isMulti ? "is-four-fifths" : "is-two-thirds",
                    "section",
                )}>
                <div className={"card"}>
                    <header
                        className={classnames(
                            "card-header",
                            "has-background-info",
                        )}>
                        <span
                            className={classnames(
                                "card-header-title",
                                "has-text-white",
                                "is-justify-content-space-between",
                                "is-align-items-center",
                            )}>
                            <span>{`${title}`}</span>
                            <small>
                                {dayjs(gameStartedAt).format("DD/MM/YYYY")}
                            </small>
                            <span>{maps[map].label}</span>
                        </span>
                    </header>
                    {!isMulti && (
                        <div className={classnames("card-image")}>
                            <table
                                className={classnames(
                                    "table",
                                    "is-striped",
                                    "is-fullwidth",
                                )}>
                                <thead>
                                    <tr>
                                        <th>{"# Round"}</th>
                                        <th>{"Distance"}</th>
                                        <th>{"Duration"}</th>
                                        <th>{"Score"}</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <td colSpan={2} />
                                        <th>{"Total:"}</th>
                                        <td>{`${players[player].score}pts`}</td>
                                    </tr>
                                </tfoot>
                                <tbody>
                                    {indexedArray(total).map(i => {
                                        const {
                                            distance,
                                            score,
                                            startedAt,
                                            endedAt,
                                        } = entries[`rnd-${i}-${player}`];
                                        const duration =
                                            endedAt && startedAt
                                                ? Math.round(
                                                      (endedAt - startedAt) /
                                                          1000,
                                                  )
                                                : null;

                                        return (
                                            <tr key={`round-${i}`}>
                                                <td>{i}</td>
                                                <td>
                                                    {distance
                                                        ? readableDistance(
                                                              distance,
                                                          )
                                                        : "-"}
                                                </td>
                                                <td>
                                                    {duration
                                                        ? readableDuration(
                                                              duration,
                                                          )
                                                        : "-"}
                                                </td>
                                                <td>
                                                    <span
                                                        className={classnames(
                                                            score === 5000 &&
                                                                "has-text-success",
                                                        )}>
                                                        {score
                                                            ? `${score}pts`
                                                            : "-"}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div
                        className={classnames(
                            "card-image",
                            `summary__${isMulti ? "multi" : "navigation"}`,
                            "mx-0",
                            `mt-${isMulti ? "0" : "1"}`,
                            isMulti && "columns",
                            "mb-0",
                        )}>
                        {$content}
                    </div>
                    {isMulti && (
                        <div className={classnames("card-image")}>
                            <table
                                className={classnames(
                                    "table",
                                    "is-striped",
                                    "is-fullwidth",
                                )}>
                                <thead>
                                    <tr>
                                        <th>{"# Round"}</th>
                                        <th>{"Player"}</th>
                                        <th>{"Distance"}</th>
                                        <th>{"Duration"}</th>
                                        <th>{"Score"}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {indexedArray(total).map(i =>
                                        Object.entries(players).map(
                                            (
                                                [key, {name, icon, isActive}],
                                                idx,
                                            ) => {
                                                const {
                                                    distance,
                                                    score,
                                                    startedAt,
                                                    endedAt,
                                                } =
                                                    entries[
                                                        `rnd-${i}-${key}`
                                                    ] || {};
                                                const duration =
                                                    endedAt && startedAt
                                                        ? Math.round(
                                                              (endedAt -
                                                                  startedAt) /
                                                                  1000,
                                                          )
                                                        : null;

                                                return (
                                                    <tr
                                                        key={`rnd-${i}-${key}`}
                                                        className={classnames(
                                                            !isActive &&
                                                                "has-text-grey-light",
                                                        )}>
                                                        {idx === 0 && (
                                                            <td
                                                                rowSpan={
                                                                    Object.keys(
                                                                        players,
                                                                    ).length
                                                                }
                                                                className={
                                                                    "summary__round-cell"
                                                                }>
                                                                {i}
                                                            </td>
                                                        )}
                                                        <td>
                                                            <img
                                                                className={
                                                                    "results__player-icon"
                                                                }
                                                                src={
                                                                    getMarkerIcon(
                                                                        icon,
                                                                    ).url
                                                                }
                                                            />
                                                            {NBSP}
                                                            {name}
                                                        </td>
                                                        <td>
                                                            {distance
                                                                ? readableDistance(
                                                                      distance,
                                                                  )
                                                                : "-"}
                                                        </td>
                                                        <td>
                                                            {duration
                                                                ? readableDuration(
                                                                      duration,
                                                                  )
                                                                : "-"}
                                                        </td>
                                                        <td>
                                                            <span
                                                                className={classnames(
                                                                    score ===
                                                                        5000 &&
                                                                        "has-text-success",
                                                                )}>
                                                                {score
                                                                    ? `${score}pts`
                                                                    : "-"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            },
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {!injected && (
                        <footer className={"card-footer"}>
                            <Button
                                label={"Restart a Match"}
                                variant={"link"}
                                className={classnames(
                                    "card-footer-item",
                                    "no-top-radius",
                                )}
                                onClick={onRestart}
                            />
                        </footer>
                    )}
                </div>
            </div>
        </div>
    );
};

Summary.propTypes = {
    onRestart: PropTypes.func,
};

export default Summary;
