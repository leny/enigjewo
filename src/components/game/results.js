/* leny/enigjewo
 *
 * /src/components/game/results.js - Game Component: results
 *
 * coded by leny@BeCode
 * started at 04/02/2021
 */

/* eslint-disable */ // WIP

import "styles/game/results.scss";

import classnames from "classnames";
import PropTypes from "prop-types";
import {useContext, useMemo, useCallback} from "react";

import {GameStoreContext} from "store/game";
import {NBSP} from "core/constants";
import {getMarkerIcon} from "core/icons";

import Button from "components/commons/button";
import GMap from "components/commons/map";
import StreetView from "components/commons/street-view";

const Results = ({onNext}) => {
    const {
        rounds: {total},
        currentRound: {index, score: totalScore},
        panoramas,
        positions,
        targets,
        distances,
        scores,
    } = useContext(GameStoreContext);

    const distance = useMemo(() => distances[index - 1], [distances, index]);
    const score = useMemo(() => scores[index - 1], [scores, index]);
    const position = useMemo(() => positions[index - 1], [positions, index]);
    const panorama = useMemo(() => panoramas[index - 1], [panoramas, index]);
    const target = useMemo(() => targets[index - 1], [targets, index]);

    const handleMapReady = useCallback(
        map => {
            const polyLine = new google.maps.Polyline({
                path: [target, position],
                strokeColor: "hsl(141, 53%, 53%)",
                strokeOpacity: 1.0,
                strokeWeight: 3,
            });
            polyLine.setMap(map);
            const targetMarker = new google.maps.Marker({
                position: target,
                map,
                icon: getMarkerIcon("target"),
            });
            const positionMarker = new google.maps.Marker({
                position,
                map,
                icon: getMarkerIcon("player1"),
            });
            map.setZoom(18);
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(targetMarker.getPosition());
            bounds.extend(positionMarker.getPosition());
            map.fitBounds(bounds);
        },
        [position, target],
    );

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
                            )}>{`Round ${index}/${total} results`}</span>
                    </header>
                    <div
                        className={classnames(
                            "card-content",
                            "has-text-centered",
                        )}>
                        <p>
                            <strong>
                                {distance > 2000
                                    ? `${Math.floor(distance / 1000)}km`
                                    : `${distance}m`}
                            </strong>
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
                    <div
                        className={classnames(
                            "card-image",
                            "columns",
                            "results__navigation",
                            "mx-0",
                            "mt-1",
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
                                position={target}
                                onMapReady={handleMapReady}
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
                                panorama={panorama}
                                options={{
                                    addressControl: true,
                                    showRoadLabels: true,
                                }}
                            />
                        </div>
                    </div>
                    <footer className={"card-footer"}>
                        <Button
                            label={"Start next round"}
                            variant={"link"}
                            className={classnames(
                                "card-footer-item",
                                "no-top-radius",
                            )}
                            onClick={onNext}
                        />
                    </footer>
                </div>
            </div>
        </div>
    );
};

Results.propTypes = {
    onNext: PropTypes.func.isRequired,
};

export default Results;
