/* leny/enigjewo
 *
 * /src/components/game/roadmap.js - Game Component: Roadmap
 *
 * coded by leny
 * started at 02/02/2021
 */

/* global google */

import "styles/game/roadmap.scss";

import {useState, useEffect, useContext, useCallback, useRef} from "react";
import {GameStoreContext} from "store/game";
import PropTypes from "prop-types";
import classnames from "classnames";

import {getCountryFromPosition} from "core/geocoder";
import {getFlag, getName} from "iso-country-conversion";

import {NBSP, GAME_RULES_GUESS_COUNTRY} from "core/constants";

import Button from "components/commons/button";
import ToolIcon from "components/game/tool-icon";
import GMap from "components/commons/map";

import {
    faThumbtack,
    faExpandAlt,
    faCompressAlt,
    faLongArrowAltDown,
    faLongArrowAltUp,
    faFlag,
    faStickyNote,
    faMapMarkerAlt,
    faWindowRestore,
    faWindowMaximize,
} from "@fortawesome/free-solid-svg-icons";

import {withValue, isFalsy} from "core/utils";
import {getMarkerIcon} from "core/icons";

const invertValue = isFalsy;

const SIZE_SMALL = "small";
const SIZE_MEDIUM = "medium";
const SIZE_BIG = "big";

const Roadmap = ({
    className,
    startPosition = {lat: 0, lng: 0},
    startZoom = 2,
    isDocked,
    isPinned,
    size,
    onTogglePinned,
    onToggleDocked,
    onShrinkSize,
    onGrowSize,
    onResetPanorama,
    onUpdatePosition,
    onGuessPosition,
}) => {
    const {
        settings: {bounds, rules},
        players,
        player: key,
    } = useContext(GameStoreContext);
    const {icon} = players[key];
    const [center] = useState(startPosition);
    const [showNotes, setShowNotes] = useState(null);
    const [notes, setNotes] = useState("");
    const [marker, setMarker] = useState(null);
    const [ready, setReady] = useState(false);
    const [country, setCountry] = useState(null);
    const gmap = useRef(null);

    useEffect(() => {
        if (!(gmap.current && bounds) || ready) {
            return;
        }

        setReady(true);
        gmap.current.fitBounds(bounds);
    }, [gmap.current, bounds, ready]);

    const handleClickOnMap = useCallback(
        async (map, {latLng}) => {
            onUpdatePosition(latLng.toJSON());

            if (!marker) {
                setMarker(
                    new google.maps.Marker({
                        position: latLng,
                        map,
                        icon: getMarkerIcon(icon),
                    }),
                );
            } else {
                marker.setPosition(latLng);
            }

            if (rules === GAME_RULES_GUESS_COUNTRY) {
                const result = await getCountryFromPosition(latLng);

                result && setCountry(result);
            }
        },
        [marker, setMarker, onUpdatePosition, icon, rules],
    );

    const handleCenterMap = useCallback(() => {
        gmap?.current.panTo(marker.getPosition());
    }, [gmap.current, marker]);

    const handleToggleStickyNote = useCallback(
        () => setShowNotes(invertValue),
        [setShowNotes],
    );

    return (
        <div
            className={classnames(
                "roadmap",
                "is-flex",
                "is-flex-direction-column",
                "is-justify-content-start",
                "is-align-content-center",
                isDocked || `roadmap--is-${isPinned ? "pinned" : "floating"}`,
                isDocked && `roadmap--is-docked`,
                size === SIZE_MEDIUM && "roadmap--size-medium",
                size === SIZE_BIG && "roadmap--size-big",
                className,
            )}>
            <div
                className={classnames(
                    "roadmap__tools",
                    "is-flex",
                    "is-flex-direction-row",
                    "is-justify-content-space-between",
                    "is-align-content-center",
                )}>
                {showNotes && (
                    <div className={classnames("mb-1", "roadmap__notes")}>
                        <textarea
                            className={classnames(
                                "textarea",
                                "roadmap__notes-area",
                                "has-fixed-size",
                            )}
                            name={"notes"}
                            placeholder={
                                "Here's a notepad for you. It's emptied after each round."
                            }
                            value={notes}
                            onChange={withValue(setNotes)}
                        />
                    </div>
                )}
                <span>
                    <ToolIcon
                        icon={faMapMarkerAlt}
                        title={"Center on Guess"}
                        disabled={!marker}
                        onClick={handleCenterMap}
                    />
                    <ToolIcon
                        icon={faFlag}
                        title={"Return to drop point"}
                        onClick={onResetPanorama}
                    />
                    <ToolIcon
                        icon={faStickyNote}
                        title={"Toggle sticky note"}
                        active={showNotes}
                        onClick={handleToggleStickyNote}
                    />
                </span>
                <span>
                    <ToolIcon
                        icon={isDocked ? faWindowRestore : faWindowMaximize}
                        title={`${isDocked ? "Floating" : "Docked"} roadmap`}
                        onClick={onToggleDocked}
                    />
                    <ToolIcon
                        icon={isDocked ? faLongArrowAltDown : faCompressAlt}
                        title={"Shrink roadmap"}
                        disabled={size === SIZE_SMALL}
                        onClick={onShrinkSize}
                    />
                    <ToolIcon
                        icon={isDocked ? faLongArrowAltUp : faExpandAlt}
                        title={"Expand roadmap"}
                        disabled={size === SIZE_BIG}
                        onClick={onGrowSize}
                    />
                    {!isDocked && (
                        <ToolIcon
                            icon={faThumbtack}
                            title={"Pin roadmap"}
                            active={isPinned}
                            onClick={onTogglePinned}
                        />
                    )}
                </span>
            </div>
            <GMap
                className={classnames("roadmap__map", "mt-1", "mb-0")}
                ref={gmap}
                position={center}
                zoom={startZoom}
                onMapClick={handleClickOnMap}
            />
            {rules === GAME_RULES_GUESS_COUNTRY && country && (
                <span
                    className={classnames(
                        "button",
                        "is-normal",
                        "no-radius",
                        "is-light",
                        "is-info",
                        "is-static",
                    )}>
                    {`${getFlag(country)}${NBSP}${NBSP}${getName(country)}`}
                </span>
            )}
            <Button
                className={"no-top-radius"}
                variant={"dark"}
                label={"Guess"}
                disabled={!marker}
                onClick={onGuessPosition}
            />
        </div>
    );
};

Roadmap.propTypes = {
    startPosition: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
    }),
    startZoom: PropTypes.number,
    isDocked: PropTypes.bool,
    isPinned: PropTypes.bool,
    size: PropTypes.string.isRequired,
    onTogglePinned: PropTypes.func.isRequired,
    onToggleDocked: PropTypes.func.isRequired,
    onShrinkSize: PropTypes.func.isRequired,
    onGrowSize: PropTypes.func.isRequired,
    onResetPanorama: PropTypes.func.isRequired,
    onUpdatePosition: PropTypes.func.isRequired,
    onGuessPosition: PropTypes.func.isRequired,
};

export default Roadmap;
