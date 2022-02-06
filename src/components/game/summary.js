/* leny/enigjewo
 *
 * /src/components/game/summary.js - Game Component: summary
 *
 * coded by leny
 * started at 04/02/2021
 */

// TODO: split

/* global google */

import "styles/game/summary.scss";

import classnames from "classnames";
import PropTypes from "prop-types";
import {useContext, useEffect, useRef} from "react";
import {renderToStaticMarkup} from "react-dom/server";

import {GameStoreContext} from "store/game";
import {
    NBSP,
    GAME_VARIANT_CHALLENGE,
    GAME_VARIANT_CLASSIC,
    GAME_RULES_EMOJIS,
    GAME_RULES_NAMES,
    GAME_RULES_CLASSIC,
    GAME_RULES_GUESS_COUNTRY,
} from "core/constants";
import {getMarkerIcon} from "core/icons";
import {readableDuration, readableDistance, indexedArray} from "core/utils";
import {maps} from "core/maps";
import dayjs from "dayjs";
import {getFlag, getName} from "iso-country-conversion";

import Button from "components/commons/button";
import GMap from "components/commons/map";
import Copiable from "components/commons/copiable";

import sendEndGameState from "store/game/actions/send-end-game-state";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCrown} from "@fortawesome/free-solid-svg-icons";

const Summary = ({showSetupChallengeButton, onRestart, onSetupChallenge}) => {
    const {
        dispatch,
        variant = GAME_VARIANT_CLASSIC,
        code,
        title,
        settings: {rounds: total, isMulti, map, rules},
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
            if (isMulti || variant === GAME_VARIANT_CHALLENGE) {
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
                const {position, distance, score} =
                    entries[`rnd-${i}-${player}`];
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
    }, [
        // gmap.current,
        isMulti,
        entries,
        player,
        players,
        rounds,
        total,
        variant,
    ]);

    const $gmap = <GMap className={classnames("summary__map")} ref={gmap} />;

    let $content = $gmap;
    let $challenge = null;

    if (variant === GAME_VARIANT_CHALLENGE) {
        const gameURL = `${location.protocol}//${location.host}${location.pathname}?c=${code}`;

        $challenge = (
            <div className={classnames("card-image", "p-3")}>
                <div
                    className={classnames("notification", "is-warning", "p-3")}>
                    <p>
                        {
                            "Any player can join this challenge by simply use the following code or URL:"
                        }
                    </p>
                    <div className={classnames("has-text-centered")}>
                        <strong
                            className={classnames(
                                "is-block",
                                "is-size-3",
                                "is-family-code",
                            )}>
                            <Copiable text={code}>{code}</Copiable>
                        </strong>
                        <span
                            className={classnames(
                                "is-size-6",
                                "is-family-code",
                            )}>
                            <Copiable text={gameURL}>{gameURL}</Copiable>
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    const completeMode = isMulti || variant === GAME_VARIANT_CHALLENGE;

    if (completeMode) {
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
                    completeMode ? "is-four-fifths" : "is-two-thirds",
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
                            <span>
                                <small className={"is-block"}>
                                    {maps[map].label}
                                </small>
                                {rules !== GAME_RULES_CLASSIC && (
                                    <small className={classnames("is-block")}>
                                        {`${GAME_RULES_EMOJIS[rules]}${NBSP}${NBSP}${GAME_RULES_NAMES[rules]}`}
                                    </small>
                                )}
                            </span>
                        </span>
                    </header>
                    {!completeMode && (
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
                                        <th>
                                            {rules === GAME_RULES_GUESS_COUNTRY
                                                ? "Guess"
                                                : "Distance"}
                                        </th>
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
                                        const {country: targetCountry} =
                                            rounds[`rnd-${i}`];
                                        const {
                                            distance,
                                            score,
                                            country,
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

                                        const targetCountryName = `${getFlag(
                                            targetCountry,
                                        )}${NBSP}${NBSP}${getName(
                                            targetCountry,
                                        )}`;

                                        const guessCountryName = `${getFlag(
                                            country,
                                        )}${NBSP}${NBSP}${getName(country)}`;

                                        return (
                                            <tr key={`round-${i}`}>
                                                <td>
                                                    {i}
                                                    {rules ===
                                                        GAME_RULES_GUESS_COUNTRY && (
                                                        <>
                                                            {NBSP}
                                                            <small>
                                                                {
                                                                    targetCountryName
                                                                }
                                                            </small>
                                                        </>
                                                    )}
                                                </td>
                                                <td>
                                                    {rules ===
                                                    GAME_RULES_GUESS_COUNTRY ? (
                                                        <small>
                                                            {guessCountryName}
                                                        </small>
                                                    ) : distance ? (
                                                        readableDistance(
                                                            distance,
                                                        )
                                                    ) : (
                                                        "-"
                                                    )}
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
                                                            rules ===
                                                                GAME_RULES_GUESS_COUNTRY
                                                                ? score === 1
                                                                    ? "has-text-success"
                                                                    : "has-text-danger"
                                                                : score ===
                                                                      5000 &&
                                                                      "has-text-success",
                                                        )}>
                                                        {score
                                                            ? `${score}pt${
                                                                  score > 1
                                                                      ? "s"
                                                                      : ""
                                                              }`
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
                    {$challenge}
                    <div
                        className={classnames(
                            "card-image",
                            `summary__${completeMode ? "multi" : "navigation"}`,
                            "mx-0",
                            `mt-${completeMode ? "0" : "1"}`,
                            completeMode && "columns",
                            "mb-0",
                        )}>
                        {$content}
                    </div>
                    {completeMode && (
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
                                    {indexedArray(total).map(i => {
                                        const {country: targetCountry} =
                                            rounds[`rnd-${i}`];
                                        return Object.entries(players).map(
                                            (
                                                [key, {name, icon, isActive}],
                                                idx,
                                            ) => {
                                                const {
                                                    distance,
                                                    score,
                                                    country,
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

                                                const targetCountryName = `${getFlag(
                                                    targetCountry,
                                                )}${NBSP}${NBSP}${getName(
                                                    targetCountry,
                                                )}`;

                                                const guessCountryName = `${getFlag(
                                                    country,
                                                )}${NBSP}${NBSP}${getName(
                                                    country,
                                                )}`;

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
                                                                {rules ===
                                                                    GAME_RULES_GUESS_COUNTRY && (
                                                                    <>
                                                                        {NBSP}
                                                                        <small>
                                                                            {
                                                                                targetCountryName
                                                                            }
                                                                        </small>
                                                                    </>
                                                                )}
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
                                                            {rules ===
                                                            GAME_RULES_GUESS_COUNTRY ? (
                                                                <small>
                                                                    {
                                                                        guessCountryName
                                                                    }
                                                                </small>
                                                            ) : distance ? (
                                                                readableDistance(
                                                                    distance,
                                                                )
                                                            ) : (
                                                                "-"
                                                            )}
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
                                                                    rules ===
                                                                        GAME_RULES_GUESS_COUNTRY
                                                                        ? score ===
                                                                          1
                                                                            ? "has-text-success"
                                                                            : "has-text-danger"
                                                                        : score ===
                                                                              5000 &&
                                                                              "has-text-success",
                                                                )}>
                                                                {score
                                                                    ? `${score}pt${
                                                                          score >
                                                                          1
                                                                              ? "s"
                                                                              : ""
                                                                      }`
                                                                    : "-"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            },
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {!injected && (
                        <footer className={"card-footer"}>
                            {showSetupChallengeButton && (
                                <Button
                                    label={"Create a Challenge from this Match"}
                                    variant={"link"}
                                    className={classnames(
                                        "card-footer-item",
                                        "only-bottom-left-radius",
                                    )}
                                    onClick={onSetupChallenge}
                                />
                            )}
                            <Button
                                label={"Restart a Match"}
                                variant={"info"}
                                className={classnames(
                                    "card-footer-item",
                                    showSetupChallengeButton
                                        ? "only-bottom-right-radius"
                                        : "no-top-radius",
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
    showSetupChallengeButton: PropTypes.bool,
    onRestart: PropTypes.func,
    onSetupChallenge: PropTypes.func,
};

export default Summary;
