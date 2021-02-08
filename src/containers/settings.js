/* leny/enigjewo
 *
 * /src/containers/settings.js - Settings Container
 *
 * coded by leny@BeCode
 * started at 05/02/2021
 */

import "styles/settings.scss";

import PropTypes from "prop-types";

import {useEffect, useRef} from "react";
import {useFormik} from "formik";

import {NBSP, DEFAULT_ROUND_DURATION, DEFAULT_ROUNDS} from "core/constants";
import {maps, loadGeoJSON} from "core/maps";
import bbox from "@turf/bbox";

import classnames from "classnames";

import Button from "components/commons/button";
import GMap from "components/commons/map";

const SettingsContainer = ({onStartGame}) => {
    const gmap = useRef(null);
    const {handleSubmit, handleChange, values} = useFormik({
        initialValues: {
            totalRounds: DEFAULT_ROUNDS,
            roundDuration: DEFAULT_ROUND_DURATION,
            map: "world",
        },
        onSubmit: ({totalRounds: rounds, roundDuration: duration, map}) => {
            // TODO: multiplayer settings
            onStartGame({
                code: `solo-${map}`,
                title: `Solo Game: ${maps[map].label}`,
                rounds,
                duration,
                map,
                isMulti: false,
                player: {
                    key: "solo-player",
                    name: "Solo Player",
                    isOwner: true,
                },
            });
        },
    });

    useEffect(() => {
        if (!gmap.current) {
            return;
        }

        gmap.current.setZoom(1);
        gmap.current.setCenter({lat: 0, lng: 0});
        gmap.current.data.forEach(f => gmap.current.data.remove(f));

        if (values.map !== "world") {
            (async () => {
                const geoJSON = await loadGeoJSON(values.map);
                const [west, south, east, north] = bbox(geoJSON);
                gmap.current.data.addGeoJson(geoJSON);
                gmap.current.data.setStyle({
                    fillColor: "hsl(204, 86%, 53%)",
                    strokeColor: "hsl(217, 71%, 53%)",
                    strokeWeight: 2,
                });
                gmap.current.fitBounds({north, east, south, west});
            })();
        }
    }, [gmap.current, values.map]);

    return (
        <div className={classnames("columns", "is-centered")}>
            <div className={classnames("column", "is-two-thirds", "section")}>
                <form action={"#"} onSubmit={handleSubmit}>
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
                                {"Start a Game"}
                            </span>
                        </header>
                        <div className={classnames("card-content")}>
                            <div className={"field"}>
                                <label htmlFor={"totalRounds"}>
                                    {"Number of rounds"}
                                </label>
                                <div className={"control"}>
                                    <input
                                        type={"number"}
                                        id={"totalRounds"}
                                        name={"totalRounds"}
                                        className={"input"}
                                        min={1}
                                        value={values.totalRounds}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className={"field"}>
                                <label htmlFor={"roundDuration"}>
                                    {"Round duration"}
                                    {NBSP}
                                    <small className={"has-text-grey"}>
                                        {"(in minutes)"}
                                    </small>
                                </label>
                                <div
                                    className={classnames(
                                        "control",
                                        "is-flex",
                                        "is-align-content-space-between",
                                        "is-align-items-center",
                                    )}>
                                    <div
                                        className={classnames(
                                            "settings__duration-range",
                                        )}>
                                        <input
                                            type={"range"}
                                            name={"roundDuration"}
                                            id={"roundDuration"}
                                            min={0}
                                            value={values.roundDuration}
                                            step={30}
                                            max={600}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div
                                        className={classnames(
                                            "settings__duration-value",
                                            "px-2",
                                            "has-text-centered",
                                        )}>
                                        <strong>
                                            {values.roundDuration
                                                ? `${String(
                                                      ~~(
                                                          values.roundDuration /
                                                          60
                                                      ),
                                                  ).padStart(2, "0")}:${String(
                                                      values.roundDuration % 60,
                                                  ).padStart(2, "0")}`
                                                : "Infinite"}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                            <div className={"field"}>
                                <label htmlFor={"map"}>{"Map"}</label>
                                <div className={"control"}>
                                    <div className={"select"}>
                                        <select
                                            id={"map"}
                                            name={"map"}
                                            value={values.map}
                                            onChange={handleChange}>
                                            {Object.entries(maps).map(
                                                ([key, {label}]) => (
                                                    <option
                                                        key={key}
                                                        value={key}>
                                                        {label}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"card-image"}>
                            <GMap className={"settings__map"} ref={gmap} />
                        </div>
                        <footer className={"card-footer"}>
                            <Button
                                type={"submit"}
                                label={"Start"}
                                variant={"link"}
                                className={classnames(
                                    "card-footer-item",
                                    "no-top-radius",
                                )}
                            />
                        </footer>
                    </div>
                </form>
            </div>
        </div>
    );
};

SettingsContainer.propTypes = {
    onStartGame: PropTypes.func.isRequired,
};

export default SettingsContainer;
