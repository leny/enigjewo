/* leny/enigjewo
 *
 * /src/components/game/roadmap.js - Game Component: Roadmap
 *
 * coded by leny@BeCode
 * started at 02/02/2021
 */

/* global google */

import "styles/game/roadmap.scss";

import {useState, useCallback} from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Button from "components/commons/button";
import ToolIcon from "components/game/tool-icon";
import GMap from "components/commons/map";

import {
    faThumbtack,
    faExpandAlt,
    faCompressAlt,
    faMapMarkerAlt,
    faFlag,
    faStickyNote,
} from "@fortawesome/free-solid-svg-icons";

import {withValue, isFalsy} from "core/utils";

const invertValue = isFalsy;

const SIZE_SMALL = "small";
const SIZE_MEDIUM = "medium";
const SIZE_BIG = "big";

const Roadmap = ({
    startPosition = {lat: 0, lng: 0},
    startZoom = 2,
    onResetPanorama,
    onUpdatePosition,
    onGuessPosition,
}) => {
    const [center, setCenter] = useState(startPosition);
    const [discriminator, setDiscriminator] = useState(Date.now());
    const [showNotes, setShowNotes] = useState(null);
    const [notes, setNotes] = useState("");
    const [marker, setMarker] = useState(null);
    const [size, setSize] = useState(SIZE_SMALL);
    const [isPinned, setIsPinned] = useState(false);

    const handleClickOnMap = useCallback(
        (map, {latLng}) => {
            onUpdatePosition(latLng.toJSON());

            if (!marker) {
                setMarker(new google.maps.Marker({position: latLng, map}));
                return;
            }

            marker.setPosition(latLng);
        },
        [marker, setMarker, onUpdatePosition],
    );

    const handleCenterOnMarker = useCallback(() => {
        setCenter(marker.getPosition());
        setDiscriminator(Date.now());
    }, [marker, setCenter]);

    const handleToggleStickyNote = useCallback(
        () => setShowNotes(invertValue),
        [setShowNotes],
    );

    const handlePinBox = useCallback(() => setIsPinned(invertValue), [
        setIsPinned,
    ]);

    const handleGrowBox = useCallback(
        () =>
            setSize(
                v =>
                    ({
                        [SIZE_SMALL]: SIZE_MEDIUM,
                        [SIZE_MEDIUM]: SIZE_BIG,
                        [SIZE_BIG]: SIZE_BIG,
                    }[v]),
            ),
        [setSize],
    );

    const handleShrinkBox = useCallback(
        () =>
            setSize(v =>
                setSize(
                    {
                        [SIZE_SMALL]: SIZE_SMALL,
                        [SIZE_MEDIUM]: SIZE_SMALL,
                        [SIZE_BIG]: SIZE_MEDIUM,
                    }[v],
                ),
            ),
        [setSize],
    );

    return (
        <div
            className={classnames(
                "roadmap",
                "is-flex",
                "is-flex-direction-column",
                "is-justify-content-start",
                "is-align-content-center",
                `roadmap--is-${isPinned ? "pinned" : "floating"}`,
                size === SIZE_MEDIUM && "roadmap--size-medium",
                size === SIZE_BIG && "roadmap--size-big",
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
            <div
                className={classnames(
                    "roadmap__tools",
                    "is-flex",
                    "is-flex-direction-row",
                    "is-justify-content-space-between",
                    "is-align-content-center",
                )}>
                <span>
                    <ToolIcon
                        icon={faMapMarkerAlt}
                        title={"Center on marker"}
                        disabled={!marker}
                        onClick={handleCenterOnMarker}
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
                        icon={faCompressAlt}
                        title={"Shrink roadmap"}
                        disabled={size === SIZE_SMALL}
                        onClick={handleShrinkBox}
                    />
                    <ToolIcon
                        icon={faExpandAlt}
                        title={"Expand roadmap"}
                        disabled={size === SIZE_BIG}
                        onClick={handleGrowBox}
                    />
                    <ToolIcon
                        icon={faThumbtack}
                        title={"Pin roadmap"}
                        active={isPinned}
                        onClick={handlePinBox}
                    />
                </span>
            </div>
            <GMap
                className={classnames("roadmap__map", "my-1")}
                position={center}
                discriminator={discriminator}
                zoom={startZoom}
                onMapClick={handleClickOnMap}
            />
            <Button
                variant={"dark"}
                label={"Guess"}
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
    onResetPanorama: PropTypes.func.isRequired,
    onUpdatePosition: PropTypes.func.isRequired,
    onGuessPosition: PropTypes.func.isRequired,
};

export default Roadmap;
