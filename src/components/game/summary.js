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
import {useContext, useCallback} from "react";
import {renderToStaticMarkup} from "react-dom/server";

import {GameStoreContext} from "store/game";
import {NBSP} from "core/constants";
import {getMarkerIcon} from "core/icons";

import Button from "components/commons/button";
import GMap from "components/commons/map";

const Summary = ({onRestart}) => {
    const {
        rounds: {total},
        currentRound: {score},
        positions,
        targets,
        distances,
        scores,
    } = useContext(GameStoreContext);

    const handleMapReady = useCallback(
        map => {
            const bounds = new google.maps.LatLngBounds();
            map.setZoom(18);
            Array.from(new Array(total).keys()).forEach(i => {
                const polyLine = new google.maps.Polyline({
                    path: [targets[i], positions[i]],
                    strokeColor: "hsl(141, 53%, 53%)",
                    strokeOpacity: 1.0,
                    strokeWeight: 3,
                });
                polyLine.setMap(map);
                const targetInfoWindow = new google.maps.InfoWindow({
                    content: renderToStaticMarkup(
                        <>
                            <h5 className={"mb-1"}>
                                {`Round #${i + 1}: Target`}
                            </h5>
                            <p>
                                {`${targets[i].lat.toFixed(4)}, ${targets[
                                    i
                                ].lng.toFixed(4)}`}
                            </p>
                        </>,
                    ),
                });
                const targetMarker = new google.maps.Marker({
                    position: targets[i],
                    map,
                    icon: getMarkerIcon("target"),
                });
                targetMarker.addListener("click", () =>
                    targetInfoWindow.open(map, targetMarker),
                );
                const positionInfoWindow = new google.maps.InfoWindow({
                    content: renderToStaticMarkup(
                        <>
                            <h5 className={"mb-1"}>
                                {`Round #${i + 1}: Your guess`}
                            </h5>
                            <p>
                                {distances[i] > 2000
                                    ? `${Math.floor(distances[i] / 1000)}km`
                                    : `${distances[i]}m`}
                                {`${NBSP}-${NBSP}`}
                                <strong
                                    className={classnames(
                                        scores[i] === 5000 &&
                                            "has-text-success",
                                    )}>
                                    {`${scores[i]}pts`}
                                </strong>
                            </p>
                            <p>
                                <small>
                                    {`${positions[i].lat.toFixed(
                                        4,
                                    )}, ${positions[i].lng.toFixed(4)}`}
                                </small>
                            </p>
                        </>,
                    ),
                });
                const positionMarker = new google.maps.Marker({
                    position: positions[i],
                    map,
                    icon: getMarkerIcon("player1"),
                });
                positionMarker.addListener("click", () =>
                    positionInfoWindow.open(map, positionMarker),
                );
                bounds.extend(targetMarker.getPosition());
                bounds.extend(positionMarker.getPosition());
            });
            map.fitBounds(bounds, {top: 30, right: 30, bottom: 30, left: 30});
        },
        [positions, targets, total, scores, distances],
    );

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
                                    <th>{"Score"}</th>
                                </tr>
                            </thead>
                            <tfoot>
                                <tr>
                                    <td />
                                    <th>{"Total:"}</th>
                                    <td>{`${score}pts`}</td>
                                </tr>
                            </tfoot>
                            <tbody>
                                {Array.from(new Array(total).keys()).map(i => (
                                    <tr key={`round-${i + 1}`}>
                                        <td>{i + 1}</td>
                                        <td>
                                            {distances[i] > 2000
                                                ? `${Math.floor(
                                                      distances[i] / 1000,
                                                  )}km`
                                                : `${distances[i]}m`}
                                        </td>
                                        <td>
                                            <span
                                                className={classnames(
                                                    scores[i] === 5000 &&
                                                        "has-text-success",
                                                )}>
                                                {`${scores[i]}pts`}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
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
                            position={targets[0]}
                            onMapReady={handleMapReady}
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
