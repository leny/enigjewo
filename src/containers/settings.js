/* leny/enigjewo
 *
 * /src/containers/settings.js - Settings Container
 *
 * coded by leny
 * started at 05/02/2021
 */

import "styles/settings.scss";

import PropTypes from "prop-types";

import {useEffect, useRef, useMemo} from "react";
import {useFormik} from "formik";
import {useLocalStorage} from "react-use-storage";

import {
    DEFAULT_ROUND_DURATION,
    DEFAULT_ROUNDS,
    NBSP,
    GAME_RULES_CLASSIC,
    GAME_RULES_STATIONARY,
    GAME_RULES_GUESS_COUNTRY,
    GAME_RULES_EMOJIS,
    GAME_RULES_NAMES,
} from "core/constants";
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
            rules: GAME_RULES_CLASSIC,
        },
        onSubmit: ({
            totalRounds: rounds,
            roundDuration: duration,
            map,
            title,
            isMulti,
            name,
            isOwner,
            rules,
        }) => {
            const key =
                name !== rawPlayerName ? generatePlayerKey(name) : rawPlayerKey;
            onStartGame({
                code: hashid(),
                title: title || `Solo Game: ${maps[map].label}`,
                rounds,
                duration,
                map,
                rules,
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

    const rulesExplain = useMemo(
        () =>
            ({
                [GAME_RULES_CLASSIC]:
                    "Moving around and using what you see, try to pin your drop point on a map.",
                [GAME_RULES_STATIONARY]: (
                    <>
                        {"You can't move on StreetView!"}
                        <br />
                        {
                            "Using only what you see around you, can you guess your drop point on the map?"
                        }
                        <br />
                        {"Not an easy task, indeed!"}
                    </>
                ),
                [GAME_RULES_GUESS_COUNTRY]: (
                    <>
                        {
                            "Moving around and using what you see, can you guess the country you're in?!"
                        }
                        <br />
                        {"This seems easier, but sometimes, it's tricky!"}
                    </>
                ),
            }[values.rules]),
        [values.rules],
    );

    const mapChoices = useMemo(
        () =>
            Object.fromEntries(
                Object.entries(groups[values.rules]).map(
                    ([key, {label, maps: elts}]) => [
                        key,
                        {
                            label,
                            options: Object.fromEntries(
                                Object.entries(maps)
                                    .filter(([m]) => elts.includes(m))
                                    .map(([k, {label: lbl}]) => [k, lbl]),
                            ),
                        },
                    ],
                ),
            ),
        [values.rules],
    );

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

    useEffect(() => {
        setFieldValue("map", "world");
    }, [values.rules]);

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

                            <div className={classnames("columns")}>
                                <div
                                    className={classnames("column", "is-half")}>
                                    <div
                                        className={classnames(
                                            "is-flex",
                                            "is-justify-content-space-between",
                                        )}>
                                        <Input
                                            id={"totalRounds"}
                                            className={classnames("mr-3")}
                                            style={{width: "20%"}}
                                            name={"totalRounds"}
                                            label={"Rounds"}
                                            type={"number"}
                                            value={values.totalRounds}
                                            min={1}
                                            onChange={handleChange}
                                        />
                                        <DurationSelector
                                            id={"roundDuration"}
                                            className={classnames(
                                                "is-flex-grow-1",
                                            )}
                                            name={"roundDuration"}
                                            value={values.roundDuration}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <Select
                                        id={"map"}
                                        name={"map"}
                                        label={"Map"}
                                        withGroups
                                        choices={mapChoices}
                                        value={values.map}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div
                                    className={classnames("column", "is-half")}>
                                    <Select
                                        id={"rules"}
                                        name={"rules"}
                                        label={"Rules"}
                                        choices={Object.fromEntries(
                                            [
                                                GAME_RULES_CLASSIC,
                                                GAME_RULES_STATIONARY,
                                                GAME_RULES_GUESS_COUNTRY,
                                            ].map(key => [
                                                key,
                                                `${GAME_RULES_EMOJIS[key]}${NBSP}${NBSP}${GAME_RULES_NAMES[key]}`,
                                            ]),
                                        )}
                                        value={values.rules}
                                        onChange={handleChange}
                                    />
                                    <p>
                                        <small className={"has-text-grey"}>
                                            {rulesExplain}
                                        </small>
                                    </p>
                                </div>
                            </div>
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
