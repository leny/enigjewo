/* leny/enigjewo
 *
 * /src/components/game/summary.js - Game Component: summary
 *
 * coded by leny@BeCode
 * started at 04/02/2021
 */

/* eslint-disable */ // WIP

import "styles/game/summary.scss";

import classnames from "classnames";
import PropTypes from "prop-types";
import {useContext, useCallback} from "react";

import {GameStoreContext} from "store/game";
import {NBSP} from "core/constants";
import {getMarkerIcon} from "core/icons";

import Button from "components/commons/button";
import GMap from "components/commons/map";
import StreetView from "components/commons/street-view";

const Summary = ({onRestart}) => {
    const {
        rounds: {total},
        currentRound: {score},
        panoramas,
        positions,
        targets,
        distances,
        scores,
    } = useContext(GameStoreContext);

    const handleMapReady = useCallback(map => {}, []);

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
                    <div
                        className={classnames(
                            "card-content",
                            "has-text-centered",
                        )}>
                        <p>
                            {"Total score:"}
                            {NBSP}
                            <strong>{`${score}pts`}</strong>
                        </p>
                    </div>
                    <div className={classnames("card-image")}>
                        <table
                            className={classnames(
                                "table",
                                "is-striped",
                                "is-fullwidth",
                            )}>
                            <thead>
                                <tr>
                                    <th>
                                        <abbr title={"Round number"}>
                                            {"Rnd"}
                                        </abbr>
                                    </th>
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
                                                )}>{`${scores[i]}pts`}</span>
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
