/* leny/enigjewo
 *
 * /src/containers/menu.js - Menu Container
 *
 * coded by leny
 * started at 01/02/2021
 */

import "styles/menu.scss";

import PropTypes from "prop-types";
import classnames from "classnames";
import {useState} from "react";
import {parse} from "qs";

import {NBSP} from "core/constants";
import {withValue} from "core/utils";

import {version} from "../../package.json";

import Button from "components/commons/button";

const MenuContainer = ({onPrepareGame, onJoinGame}) => {
    const [code, setCode] = useState(
        (parse(location.search || "", {ignoreQueryPrefix: true}) || {}).c || "",
    );

    return (
        <div className={classnames("columns", "mt-5")}>
            <div
                className={classnames(
                    "column",
                    "is-half",
                    "is-offset-one-quarter",
                )}>
                <div className={classnames("notification")}>
                    <h1 className={"title"}>{"Enigjewo"}</h1>
                    <h2 className={"subtitle"}>{"A Geoguessr clone"}</h2>

                    <p>
                        {
                            "Game is simple: you're dropped somewhere on StreetView."
                        }
                        <br />
                        {
                            "Moving around and using what you see, try to pin your drop point on a map."
                        }
                    </p>

                    <p>{"The closer you get, the better your score!"}</p>

                    <div
                        className={classnames(
                            "notification",
                            "is-warning",
                            "mt-2",
                            "px-3",
                            "py-2",
                        )}>
                        <small>
                            <strong>{"NOTE:"}</strong>
                            {NBSP}
                            {"This game is in beta. There might be some bugs."}
                        </small>
                    </div>
                </div>
                <div
                    className={classnames(
                        "is-flex",
                        "is-flex-direction-column",
                        "is-justify-content-space-between",
                        "is-align-content-center",
                    )}>
                    <Button
                        className={"mb-5"}
                        label={"Start a game"}
                        size={"large"}
                        variant={"link"}
                        onClick={() => onPrepareGame()}
                    />
                    <div className={classnames("field", "has-addons")}>
                        <div className={classnames("control", "menu__map")}>
                            <input
                                type={"text"}
                                placeholder={"Game or Challenge Code"}
                                className={classnames("input", "is-medium")}
                                value={code}
                                onChange={withValue(setCode)}
                            />
                        </div>
                        <div className={"control"}>
                            <Button
                                label={"Join"}
                                size={"medium"}
                                variant={"info"}
                                disabled={!code}
                                onClick={() => onJoinGame(code)}
                            />
                        </div>
                    </div>
                </div>
                <hr />
                <div
                    className={classnames(
                        "has-text-centered",
                        "has-text-grey-lighter",
                        "is-family-code",
                    )}>
                    <a href={"//github.com/leny/enigjewo"} target={"_new"}>
                        enigjewo
                    </a>
                    {` - v${version}`}
                </div>
            </div>
        </div>
    );
};

MenuContainer.propTypes = {
    onPrepareGame: PropTypes.func.isRequired,
    onJoinGame: PropTypes.func.isRequired,
};

export default MenuContainer;
