/* leny/enigjewo
 *
 * /src/components/game/roadmap.js - Game Component: Roadmap
 *
 * coded by leny@BeCode
 * started at 02/02/2021
 */

/* eslint-disable */ // WIP

/* global google */

import "styles/game/roadmap.scss";

import {useRef, useEffect, useState, useCallback} from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Button from "components/commons/button";
import ToolIcon from "components/game/tool-icon";

import {
    faThumbtack,
    faExpandAlt,
    faCompressAlt,
    faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

const SIZE_SMALL = "small";
const SIZE_MEDIUM = "medium";
const SIZE_BIG = "big";

const Roadmap = ({
    startPosition = {lat: 0, lng: 0},
    startZoom = 2,
    onGuessPosition,
}) => {
    const box = useRef(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [size, setSize] = useState(SIZE_SMALL);
    const [isPinned, setIsPinned] = useState(false);

    const handleClickOnMap = useCallback(
        ({latLng}) => {
            if (!marker) {
                setMarker(new google.maps.Marker({position: latLng, map}));
                return;
            }

            marker.setPosition(latLng);
        },
        [map, marker, setMarker],
    );

    const handleMakeGuess = useCallback(() => {
        // TODO: check if position exists, else select random one
        // onGuessPosition(position);
    }, [onGuessPosition]);

    const handleCenterOnMarker = useCallback(() => {
        map.panTo(marker.getPosition())
    }, [map, marker]);

    const handlePinBox = useCallback(() => setIsPinned((v) => !v), [
        setIsPinned,
    ]);

    const handleGrowBox = useCallback(
        () =>
            setSize(
                (v) =>
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
            setSize((v) =>
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

    useEffect(() => {
        if (map || !box.current) {
            return;
        }

        setMap(
            new google.maps.Map(box.current, {
                center: startPosition,
                zoom: startZoom,
                disableDefaultUI: true,
                zoomControl: true,
            }),
        );
    }, [box, map, setMap, startPosition, startZoom]);

    useEffect(() => {
        if (!map) {
            return;
        }

        map.addListener("click", handleClickOnMap);
    }, [map, handleClickOnMap]);

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
            <div
                className={classnames(
                    "roadmap__tools",
                    "is-flex",
                    "is-flex-direction-row",
                    "is-justify-content-space-between",
                    "is-align-content-center",
                )}>
                <ToolIcon
                    icon={faMapMarkerAlt}
                    title={"Center on marker"}
                    disabled={!marker}
                    onClick={handleCenterOnMarker}
                />
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
            <div className={classnames("roadmap__map", "my-1")} ref={box} />
            <Button
                variant={"dark"}
                label={"Guess"}
                onClick={handleMakeGuess}
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
    onGuessPosition: PropTypes.func.isRequired,
};

export default Roadmap;
