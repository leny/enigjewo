/* leny/enigjewo
 *
 * /src/components/game/lobby.js - Game Component: Lobby
 *
 * coded by leny@BeCode
 * started at 09/02/2021
 */

import PropTypes from "prop-types";

import "styles/lobby.scss";

import {useContext, useEffect, useRef} from "react";

import {GameStoreContext} from "store/game";

import {NBSP} from "core/constants";
import {maps, loadGeoJSON} from "core/maps";
import {getMarkerIcon} from "core/icons";
import bbox from "@turf/bbox";
import classnames from "classnames";
import {db} from "core/firebase";
import receivingPlayerInfos from "store/game/actions/receiving-player-infos";

import Button from "components/commons/button";
import GMap from "components/commons/map";
import Copiable from "components/commons/copiable";

const Lobby = ({onStartMatch}) => {
    const gmap = useRef(null);
    const {
        dispatch,
        code,
        title,
        settings: {map, rounds, duration},
        players,
        player: key,
    } = useContext(GameStoreContext);
    const player = players[key];
    const gameURL = `${location.protocol}//${location.host}${location.pathname}?c=${code}`;

    useEffect(() => {
        db.ref(`games/${code}/players`).on(
            "child_added",
            snapshot =>
                snapshot.key !== key &&
                dispatch(
                    receivingPlayerInfos({
                        key: snapshot.key,
                        player: snapshot.val(),
                    }),
                ),
        );
        return () => db.ref(`games/${code}/players`).off("child_added");
    }, []);

    useEffect(() => {
        if (!gmap.current) {
            return;
        }

        gmap.current.setZoom(1);
        gmap.current.setCenter({lat: 0, lng: 0});
        gmap.current.data.forEach(f => gmap.current.data.remove(f));

        if (map !== "world") {
            (async () => {
                const geoJSON = await loadGeoJSON(map);
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
    }, [gmap.current, map]);

    let $footer = (
        <span
            className={classnames(
                "button",
                "is-static",
                "card-footer-item",
                "no-top-radius",
            )}>
            {`Waiting for ${
                Object.values(players).find(({isOwner}) => isOwner).name
            } to start the game…`}
        </span>
    );

    if (player.isOwner) {
        const playersCount = Object.keys(players).length;

        $footer = (
            <Button
                type={"button"}
                disabled={playersCount < 2}
                label={playersCount < 2 ? "Waiting for players…" : "Start Game"}
                variant={"link"}
                className={classnames("card-footer-item", "no-top-radius")}
                onClick={onStartMatch}
            />
        );
    }

    return (
        <div className={classnames("columns", "is-centered")}>
            <div
                className={classnames(
                    "column",
                    "is-three-quarters",
                    "section",
                )}>
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
                            {title}
                        </span>
                    </header>
                    {player.isOwner && (
                        <div
                            className={classnames(
                                "card-content",
                                "has-text-centered",
                            )}>
                            <div className={classnames("mb-2")}>
                                <strong
                                    className={classnames(
                                        "is-block",
                                        "is-size-2",
                                        "is-family-code",
                                    )}>
                                    <Copiable text={code}>{code}</Copiable>
                                </strong>
                                <span
                                    className={("is-size-5", "is-family-code")}>
                                    <Copiable text={gameURL}>
                                        {gameURL}
                                    </Copiable>
                                </span>
                            </div>
                            <div
                                className={classnames(
                                    "notification",
                                    "is-info",
                                    "is-light",
                                )}>
                                {
                                    "Send the code or the URL to the players & wait for them to join the game."
                                }
                            </div>
                        </div>
                    )}
                    <div
                        className={classnames(
                            "card-image",
                            "columns",
                            "mx-0",
                            "mb-0",
                            "mt-0",
                        )}>
                        <div
                            className={classnames(
                                "column",
                                "is-two-thirds",
                                "p-0",
                                "has-background-info-light",
                            )}>
                            <GMap className={"lobby__map"} ref={gmap} />
                        </div>
                        <div
                            className={classnames(
                                "column",
                                `pt-${player.isOwner ? "0" : "2"}`,
                            )}>
                            <ul>
                                <li>
                                    <strong>{"Rounds:"}</strong>
                                    {NBSP}
                                    {rounds}
                                </li>
                                <li>
                                    <strong>{"Duration:"}</strong>
                                    {NBSP}
                                    {duration
                                        ? `${String(
                                              Math.floor(duration / 60),
                                          ).padStart(2, "0")}:${String(
                                              duration % 60,
                                          ).padStart(2, "0")}`
                                        : "Infinite"}
                                </li>
                                <li>
                                    <strong>{"Map:"}</strong>
                                    {NBSP}
                                    {maps[map].label}
                                </li>
                            </ul>
                            <hr />
                            <h6
                                className={classnames(
                                    "has-text-centered",
                                    "mb-3",
                                )}>
                                {"Players"}
                            </h6>
                            <ul>
                                {Object.values(players).map(({name, icon}) => (
                                    <li key={name}>
                                        <img
                                            className={"lobby__player-icon"}
                                            src={getMarkerIcon(icon).url}
                                        />
                                        {NBSP}
                                        {name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <footer className={"card-footer"}>{$footer}</footer>
                </div>
            </div>
        </div>
    );
};

Lobby.propTypes = {
    onStartMatch: PropTypes.func.isRequired,
};

export default Lobby;
