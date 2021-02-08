/* leny/enigjewo
 *
 * /src/containers/menu.js - Menu Container
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import PropTypes from "prop-types";
import classnames from "classnames";

import {NBSP} from "core/constants";

import Button from "components/commons/button";

const MenuContainer = ({onPrepareGame, onJoinGame}) => (
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
                    {"Game is simple. You're dropped somewhere on StreetView."}
                    <br />
                    {
                        "Using only what you see on StreetView, try to pin on a map your drop point."
                    }
                </p>

                <p>{"The closer you get, the better your score!"}</p>

                <div
                    className={classnames(
                        "notification",
                        "is-warning",
                        "mt-2",
                    )}>
                    <strong>{"NOTE:"}</strong>
                    {NBSP}
                    {"This game is in beta. There might be some bugs."}
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
                    className={"mb-3"}
                    label={"Start a game"}
                    size={"large"}
                    variant={"link"}
                    onClick={() => onPrepareGame()}
                />
                <Button
                    label={"Join a game"}
                    size={"medium"}
                    variant={"info"}
                    onClick={() => onJoinGame()}
                />
            </div>
        </div>
    </div>
);

MenuContainer.propTypes = {
    onPrepareGame: PropTypes.func.isRequired,
    onJoinGame: PropTypes.func.isRequired,
};

export default MenuContainer;
