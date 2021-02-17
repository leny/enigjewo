/* leny/enigjewo
 *
 * /src/components/game/results.js - Game Component: results
 *
 * coded by leny@BeCode
 * started at 04/02/2021
 */

// TODO: split

/* global google */

import "styles/game/results.scss";

import classnames from "classnames";
import PropTypes from "prop-types";
import {useContext, useCallback, useEffect, useRef, useState} from "react";
import {renderToStaticMarkup} from "react-dom/server";

import {GameStoreContext} from "store/game";
import {NBSP} from "core/constants";
import {getMarkerIcon} from "core/icons";
import {
    noop,
    preventDefault,
    readableDuration,
    readableDistance,
} from "core/utils";

import Button from "components/commons/button";
import GMap from "components/commons/map";
import StreetView from "components/commons/street-view";
import receivingPlayerResults from "store/game/actions/receiving-player-results";
import receivingRoundParams from "store/game/actions/receiving-round-params";
import deactivatePlayer from "store/game/actions/deactivate-player";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCrown, faWindowClose} from "@fortawesome/free-solid-svg-icons";

import {db} from "core/firebase";

const Results = ({onNext, onEnd}) => {
    const [preparing, setPreparing] = useState(false);
    const gmap = useRef(null);
    const streetView = useRef(null);
    const gmarkers = useRef([]);
    const gpolylines = useRef([]);

    const {
        dispatch,
        code,
        settings: {rounds: total, isMulti},
        currentRound: {index},
        progressCount,
        rounds,
        entries,
        players,
        player,
        ended,
    } = useContext(GameStoreContext);
    const {panorama, target} = rounds[`rnd-${index}`];
    const bestScore = Math.max(
        ...Object.values(players).map(({score}) => score),
    );

    const handleDeactivatePlayer = useCallback(key => {
        if (isMulti) {
            dispatch(deactivatePlayer(code, key));
        }
    }, []);

    const handleNextRoundOrSummary = useCallback(() => {
        setPreparing(true);
        if (ended) {
            onEnd();
            return;
        }
        onNext();
    }, [setPreparing, onNext, onEnd]);

    useEffect(() => {
        if (isMulti) {
            db.ref(`games/${code}/entries`).on("value", snapshot =>
                dispatch(receivingPlayerResults({entries: snapshot.val()})),
            );
            db.ref(`games/${code}/currentRound`).on(
                "value",
                snapshot =>
                    index !== snapshot.val().index &&
                    dispatch(receivingRoundParams(code)),
            );

            return () => {
                db.ref(`games/${code}/entries`).off("value");
                db.ref(`games/${code}/currentRound`).off("value");
            };
        }
        return noop;
    }, []);

    useEffect(() => {
        if (!gmap.current) {
            return;
        }

        gmarkers.current.forEach(gmarker => gmarker.setMap(null));
        gpolylines.current.forEach(gpolyline => gpolyline.setMap(null));

        const bounds = new google.maps.LatLngBounds();
        gmap.current.setZoom(18);
        Object.keys(players).forEach(key => {
            const {position, distance, score} =
                entries[`rnd-${index}-${key}`] || {};
            const {icon, name} = players[key];

            if (!position) {
                return;
            }

            const bestRoundScore = Math.max(
                ...Object.entries(entries)
                    .filter(([k]) => k.startsWith(`rnd-${index}`))
                    .map(([, {score: scr}]) => scr),
            );
            const polyLine = new google.maps.Polyline({
                path: [target, position],
                strokeColor:
                    score === bestRoundScore
                        ? "hsl(141, 53%, 53%)"
                        : "hsl(48, 100%, 29%)",
                strokeOpacity: 1.0,
                strokeWeight: 3,
            });
            polyLine.setMap(gmap.current);
            gpolylines.current.push(polyLine);
            const positionInfoWindow = new google.maps.InfoWindow({
                content: renderToStaticMarkup(
                    <>
                        <h5 className={"mb-1"}>
                            {`Round #${index}: ${
                                isMulti ? name : "Your guess"
                            }`}
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
            // isMulti && positionInfoWindow.open(gmap.current, positionMarker);
            positionMarker.addListener("click", () =>
                positionInfoWindow.open(gmap.current, positionMarker),
            );
            bounds.extend(positionMarker.getPosition());
            gmarkers.current.push(positionMarker);
        });
        const targetInfoWindow = new google.maps.InfoWindow({
            content: renderToStaticMarkup(
                <>
                    <h5 className={"mb-1"}>{`Round #${index}: Target`}</h5>
                    <p>
                        {`${target.lat.toFixed(4)}, ${target.lng.toFixed(4)}`}
                    </p>
                </>,
            ),
        });
        const targetMarker = new google.maps.Marker({
            position: target,
            map: gmap.current,
            icon: getMarkerIcon("target"),
        });
        bounds.extend(targetMarker.getPosition());
        targetMarker.addListener("click", () =>
            targetInfoWindow.open(gmap.current, targetMarker),
        );
        gmarkers.current.push(targetMarker);
        gmap.current.fitBounds(bounds, {
            top: 30,
            right: 30,
            bottom: 30,
            left: 30,
        });
    }, [
        gmap.current,
        gmarkers.current,
        gpolylines.current,
        entries,
        player,
        rounds,
        total,
        index,
        players,
        target,
    ]);

    let $results;

    if (isMulti) {
        $results = (
            <div className={classnames("card-image")}>
                <table
                    className={classnames(
                        "table",
                        "is-striped",
                        "is-fullwidth",
                    )}>
                    <thead>
                        <tr>
                            <th>{"Player"}</th>
                            <th>{"Distance"}</th>
                            <th>{"Duration"}</th>
                            <th>{"Score"}</th>
                            <th>{"Total Score"}</th>
                            {players[player].isOwner && <td />}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(players).map(
                            ([
                                key,
                                {score: totalScore = 0, name, icon, isActive},
                            ]) => {
                                const $name = (
                                    <td>
                                        <img
                                            className={"results__player-icon"}
                                            src={getMarkerIcon(icon).url}
                                        />
                                        {NBSP}
                                        <span
                                            className={classnames(
                                                totalScore === bestScore && [
                                                    "has-text-success",
                                                    "has-text-weight-bold",
                                                ],
                                                !isActive &&
                                                    "has-text-grey-light",
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
                                    </td>
                                );

                                if (!entries[`rnd-${index}-${key}`]?.position) {
                                    return (
                                        <tr key={key}>
                                            {$name}
                                            <td
                                                colSpan={3}
                                                className={classnames(
                                                    "has-text-grey-light",
                                                    "has-text-centered",
                                                    "is-italic",
                                                )}>
                                                {isActive
                                                    ? "Waiting…"
                                                    : "Deactivated"}
                                            </td>
                                            <td
                                                className={
                                                    "has-text-grey-light"
                                                }>
                                                {`${totalScore}pts`}
                                            </td>
                                            {players[player].isOwner &&
                                            players[player].isActive ? (
                                                <td>
                                                    {isActive &&
                                                        key !== player && (
                                                            <a
                                                                href={"#"}
                                                                className={classnames(
                                                                    "icon",
                                                                    "has-text-danger",
                                                                )}
                                                                title={
                                                                    "Deactivate this player"
                                                                }
                                                                onClick={preventDefault(
                                                                    () =>
                                                                        handleDeactivatePlayer(
                                                                            key,
                                                                        ),
                                                                )}>
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faWindowClose
                                                                    }
                                                                />
                                                            </a>
                                                        )}
                                                </td>
                                            ) : (
                                                <td />
                                            )}
                                        </tr>
                                    );
                                }

                                const {
                                    distance,
                                    score,
                                    startedAt,
                                    endedAt,
                                } = entries[`rnd-${index}-${key}`];
                                const duration =
                                    endedAt &&
                                    startedAt &&
                                    Math.round((endedAt - startedAt) / 1000);

                                return (
                                    <tr key={key}>
                                        {$name}
                                        <td>{readableDistance(distance)}</td>
                                        <td>{readableDuration(duration)}</td>
                                        <td>
                                            <span
                                                className={classnames(
                                                    score === 5000 &&
                                                        "has-text-success",
                                                )}>
                                                {`${score}pts`}
                                            </span>
                                        </td>
                                        <td>{`${totalScore}pts`}</td>
                                        {players[player].isOwner && <td />}
                                    </tr>
                                );
                            },
                        )}
                    </tbody>
                </table>
            </div>
        );
    } else {
        const {score: totalScore} = players[player];
        const {score, distance} = entries[`rnd-${index}-${player}`];

        $results = (
            <div className={classnames("card-content", "has-text-centered")}>
                <p>
                    <strong>{readableDistance(distance)}</strong>
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
                        {"Total score:"}
                        {NBSP}
                        <strong>{`${totalScore}pts`}</strong>
                    </small>
                </p>
            </div>
        );
    }

    const allPlayersReady = Object.entries(players)
        .filter(([, {isActive}]) => isActive)
        .reduce(
            (acc, [key]) => acc && !!entries[`rnd-${index}-${key}`]?.position,
            true,
        );

    let $footer = (
        <span
            className={classnames(
                "button",
                "is-static",
                "card-footer-item",
                "no-top-radius",
            )}>
            {allPlayersReady
                ? `Waiting for ${
                      Object.values(players).find(({isOwner}) => isOwner).name
                  } to start the next round…`
                : "Waiting for players…"}
        </span>
    );

    if (players[player].isOwner) {
        let label = "Start next round";

        if (ended) {
            label = "Show summary";
        }

        if (isMulti) {
            if (!allPlayersReady) {
                label = "Waiting for players…";
            }

            if (preparing) {
                label = `Finding new location (attempt #${progressCount})…`;
            }
        }

        $footer = (
            <Button
                type={"button"}
                disabled={
                    isMulti &&
                    (preparing || !players[player].isOwner || !allPlayersReady)
                }
                label={label}
                variant={"link"}
                className={classnames("card-footer-item", "no-top-radius")}
                onClick={handleNextRoundOrSummary}
            />
        );
    } else if (allPlayersReady && ended) {
        $footer = (
            <Button
                type={"button"}
                label={"Show summary"}
                variant={"link"}
                className={classnames("card-footer-item", "no-top-radius")}
                onClick={handleNextRoundOrSummary}
            />
        );
    }

    return (
        <div className={classnames("columns", "is-centered")}>
            <div className={classnames("column", "is-four-fifths", "section")}>
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
                            )}>
                            {`Round ${index}/${total} results`}
                        </span>
                    </header>
                    {$results}
                    <div
                        className={classnames(
                            "card-image",
                            "columns",
                            "results__navigation",
                            "mx-0",
                            `mt-${isMulti ? "0" : "1"}`,
                            "mb-0",
                        )}>
                        <div
                            className={classnames(
                                "column",
                                "is-half",
                                "p-0",
                                "has-background-info-light",
                            )}>
                            <GMap
                                className={classnames("results__map")}
                                ref={gmap}
                                position={target}
                            />
                        </div>
                        <div
                            className={classnames(
                                "column",
                                "is-half",
                                "p-0",
                                "has-background-warning-light",
                            )}>
                            <StreetView
                                className={classnames("results__panorama")}
                                ref={streetView}
                                panorama={panorama}
                                options={{
                                    addressControl: true,
                                    showRoadLabels: true,
                                }}
                            />
                        </div>
                    </div>
                    <footer className={"card-footer"}>{$footer}</footer>
                </div>
            </div>
        </div>
    );
};

Results.propTypes = {
    onNext: PropTypes.func.isRequired,
};

export default Results;
