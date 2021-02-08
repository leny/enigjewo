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

import Button from "components/commons/button";
import GMap from "components/commons/map";

const Summary = ({onRestart}) => {
    const {
        settings: {rounds: total},
        rounds,
        entries,
        player,
        players,
    } = useContext(GameStoreContext);
    const gmap = useRef(null);

    useEffect(() => {
        if (!gmap.current) {
            return;
        }

        const bounds = new google.maps.LatLngBounds();
        gmap.current.setZoom(18);
        Array.from(new Array(total).keys(), i => i + 1).forEach(i => {
            const {target} = rounds[`rnd-${i}`];
            const {position, distance, score} = entries[`rnd-${i}-${player}`];

            const polyLine = new google.maps.Polyline({
                path: [target, position],
                strokeColor: "hsl(141, 53%, 53%)",
                strokeOpacity: 1.0,
                strokeWeight: 3,
            });
            polyLine.setMap(gmap.current);
            const targetInfoWindow = new google.maps.InfoWindow({
                content: renderToStaticMarkup(
                    <>
                        <h5 className={"mb-1"}>{`Round #${i + 1}: Target`}</h5>
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
            const positionInfoWindow = new google.maps.InfoWindow({
                content: renderToStaticMarkup(
                    <>
                        <h5 className={"mb-1"}>
                            {`Round #${i + 1}: Your guess`}
                        </h5>
                        <p>
                            {distance > 2000
                                ? `${Math.floor(distance / 1000)}km`
                                : `${distance}m`}
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
                icon: getMarkerIcon("player1"),
            });
            positionMarker.addListener("click", () =>
                positionInfoWindow.open(gmap.current, positionMarker),
            );
            bounds.extend(targetMarker.getPosition());
            bounds.extend(positionMarker.getPosition());
        });
        gmap.current.fitBounds(bounds, {
            top: 30,
            right: 30,
            bottom: 30,
            left: 30,
        });
    }, [gmap.current, entries, player, rounds, total]);

    return (
        <div className={classnames("columns", "is-centered")}>
            <div className={classnames("column", "is-two-thirds", "section")}>
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
                            {"Summary"}
                        </span>
                    </header>
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
                                {Array.from(
                                    new Array(total).keys(),
                                    i => i + 1,
                                ).map(i => {
                                    const {
                                        distance,
                                        score,
                                        startedAt,
                                        endedAt,
                                    } = entries[`rnd-${i}-${player}`];
                                    const duration = Math.round(
                                        (endedAt - startedAt) / 1000,
                                    );

                                    return (
                                        <tr key={`round-${i}`}>
                                            <td>{i}</td>
                                            <td>
                                                {distance > 2000
                                                    ? `${Math.floor(
                                                          distance / 1000,
                                                      )}km`
                                                    : `${distance}m`}
                                            </td>
                                            <td>
                                                {`${String(
                                                    Math.floor(duration / 60),
                                                ).padStart(2, "0")}:${String(
                                                    duration % 60,
                                                ).padStart(2, "0")}`}
                                            </td>
                                            <td>
                                                <span
                                                    className={classnames(
                                                        score === 5000 &&
                                                            "has-text-success",
                                                    )}>
                                                    {`${score}pts`}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div
                        className={classnames(
                            "card-image",
                            "summary__navigation",
                            "mx-0",
                            "mt-1",
                            "mb-0",
                        )}>
                        <GMap
                            className={classnames("summary__map")}
                            ref={gmap}
                        />
                    </div>
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
                </div>
            </div>
        </div>
    );
};

Summary.propTypes = {
    onRestart: PropTypes.func,
};

export default Summary;
