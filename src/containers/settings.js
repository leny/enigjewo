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
import {useLocalStorage} from "react-use-storage";

import {DEFAULT_ROUND_DURATION, DEFAULT_ROUNDS} from "core/constants";
import {groups, maps, loadGeoJSON} from "core/maps";
import {getRandomPlayerColor} from "core/icons";
import {hashid, generatePlayerKey} from "core/utils";
import bbox from "@turf/bbox";
import classnames from "classnames";

import Button from "components/commons/button";
import GMap from "components/commons/map";
import Box from "components/commons/box";
import Input from "components/form/input";
import Select from "components/form/select";
import Selector from "components/form/selector";
import DurationSelector from "components/settings/duration";

const SettingsContainer = ({onStartGame}) => {
    const gmap = useRef(null);
    const [rawPlayerKey, setRawPlayerKey] = useLocalStorage(
        "settings-player-key",
        generatePlayerKey("Player"),
    );
    const [rawPlayerName, setRawPlayerName] = useLocalStorage(
        "settings-player-name",
        "Player",
    );
    const {handleSubmit, handleChange, values, setFieldValue} = useFormik({
        initialValues: {
            totalRounds: DEFAULT_ROUNDS,
            roundDuration: DEFAULT_ROUND_DURATION,
            map: "world",
            isMulti: false,
            name: rawPlayerName,
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
            const key =
                name !== rawPlayerName ? generatePlayerKey(name) : rawPlayerKey;
            onStartGame({
                code: hashid(),
                title: title || `Solo Game: ${maps[map].label}`,
                rounds,
                duration,
                map,
                isMulti,
                player: {
                    key,
                    name,
                    isOwner,
                    icon: isMulti ? getRandomPlayerColor() : "white",
                },
            });
            if (name !== rawPlayerName) {
                setRawPlayerName(name);
                setRawPlayerKey(key);
            }
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

    const $footer = (
        <Button
            type={"submit"}
            label={"Start"}
            variant={"link"}
            className={classnames("card-footer-item", "no-top-radius")}
        />
    );

    return (
        <div className={classnames("columns", "is-centered")}>
            <div className={classnames("column", "is-two-thirds", "section")}>
                <form action={"#"} onSubmit={handleSubmit}>
                    <Box title={"Start a Game"} footer={$footer}>
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
                            {values.isMulti && (
                                <Input
                                    id={"title"}
                                    name={"title"}
                                    label={"Title of the game"}
                                    value={values.title}
                                    onChange={handleChange}
                                />
                            )}
                            {values.isMulti && (
                                <Input
                                    id={"name"}
                                    name={"name"}
                                    label={"Your nickname"}
                                    value={values.name}
                                    onChange={handleChange}
                                />
                            )}
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
                                withGroups
                                choices={Object.fromEntries(
                                    Object.entries(groups).map(
                                        ([key, {label, maps: elts}]) => [
                                            key,
                                            {
                                                label,
                                                options: Object.fromEntries(
                                                    Object.entries(maps)
                                                        .filter(([m]) =>
                                                            elts.includes(m),
                                                        )
                                                        .map(
                                                            ([
                                                                k,
                                                                {label: lbl},
                                                            ]) => [k, lbl],
                                                        ),
                                                ),
                                            },
                                        ],
                                    ),
                                )}
                                value={values.map}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={"card-image"}>
                            <GMap className={"settings__map"} ref={gmap} />
                        </div>
                    </Box>
                </form>
            </div>
        </div>
    );
};

SettingsContainer.propTypes = {
    onStartGame: PropTypes.func.isRequired,
};

export default SettingsContainer;
