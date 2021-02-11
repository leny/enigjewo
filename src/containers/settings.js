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

import {DEFAULT_ROUND_DURATION, DEFAULT_ROUNDS} from "core/constants";
import {maps, loadGeoJSON} from "core/maps";
import {getRandomPlayerColor} from "core/icons";
import {hashid} from "core/utils";
import bbox from "@turf/bbox";
import classnames from "classnames";

import Button from "components/commons/button";
import GMap from "components/commons/map";
import Input from "components/form/input";
import Select from "components/form/select";
import Selector from "components/form/selector";
import DurationSelector from "components/settings/duration";

const SettingsContainer = ({onStartGame}) => {
    const gmap = useRef(null);
    const {handleSubmit, handleChange, values, setFieldValue} = useFormik({
        initialValues: {
            totalRounds: DEFAULT_ROUNDS,
            roundDuration: DEFAULT_ROUND_DURATION,
            map: "world",
            isMulti: false,
            name: "Player",
            isOwner: true,
            title: "My awesome game",
        },
        onSubmit: ({
            totalRounds: rounds,
            roundDuration: duration,
            map,
            title,
            isMulti,
            name,
            isOwner,
        }) => {
            onStartGame({
                code: hashid(),
                title: title || `Solo Game: ${maps[map].label}`,
                rounds,
                duration,
                map,
                isMulti,
                player: {
                    key: hashid(
                        Date.now() +
                            name
                                .split("")
                                .map((s, i) => name.charCodeAt(i))
                                .reduce((a, i) => a + i, 0),
                    ),
                    name,
                    isOwner,
                    icon: isMulti ? getRandomPlayerColor() : "white",
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

    let $multiplayerFields;

    if (values.isMulti) {
        $multiplayerFields = (
            <>
                <Input
                    id={"title"}
                    name={"title"}
                    label={"Title of the game"}
                    value={values.title}
                    onChange={handleChange}
                />
                <Input
                    id={"name"}
                    name={"name"}
                    label={"Your nickname"}
                    value={values.name}
                    onChange={handleChange}
                />
            </>
        );
    }

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
                            <Selector
                                id={"mode-selector"}
                                value={values.isMulti}
                                choices={[
                                    {name: "Solo Game", value: false},
                                    {name: "Multiplayer Game", value: true},
                                ]}
                                onChange={val => setFieldValue("isMulti", val)}
                            />
                            {$multiplayerFields}
                            <Input
                                id={"totalRounds"}
                                name={"totalRounds"}
                                label={"Number of rounds"}
                                type={"number"}
                                value={values.totalRounds}
                                min={1}
                                onChange={handleChange}
                            />
                            <DurationSelector
                                id={"roundDuration"}
                                name={"roundDuration"}
                                value={values.roundDuration}
                                onChange={handleChange}
                            />
                            <Select
                                id={"map"}
                                name={"map"}
                                label={"Map"}
                                choices={Object.fromEntries(
                                    Object.entries(
                                        maps,
                                    ).map(([key, {label}]) => [key, label]),
                                )}
                                value={values.map}
                                onChange={handleChange}
                            />
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
