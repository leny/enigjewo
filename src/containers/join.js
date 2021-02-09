/* leny/enigjewo
 *
 * /src/containers/join.js - Join Container
 *
 * coded by leny@BeCode
 * started at 09/02/2021
 */

import "styles/settings.scss";

import PropTypes from "prop-types";

import {useEffect, useState} from "react";
import {useFormik} from "formik";

import {NBSP} from "core/constants";
import {getRandomPlayerColor} from "core/icons";
import {hashid} from "core/utils";
import {db} from "core/firebase";
import classnames from "classnames";

import Button from "components/commons/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes, faCheck} from "@fortawesome/free-solid-svg-icons";

const JoinContainer = ({code, onJoinGame}) => {
    const [checkingCode, setCheckingCode] = useState(true);
    const [game, setGame] = useState(null);
    const {handleSubmit, handleChange, values} = useFormik({
        initialValues: {
            name: "",
        },
        onSubmit: ({name}) => {
            name &&
                onJoinGame({
                    code,
                    join: true,
                    player: {
                        key: hashid(
                            Date.now() +
                                name
                                    .split("")
                                    .map((s, i) => name.charCodeAt(i))
                                    .reduce((a, i) => a + i, 0),
                        ),
                        name,
                        isOwner: false,
                        icon: getRandomPlayerColor(),
                    },
                });
        },
    });

    useEffect(() => {
        (async () => {
            setGame((await db.ref(`games/${code}`).get()).val());
            setCheckingCode(false);
        })();
    }, [code]);

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
                                {"Join a Game"}
                            </span>
                        </header>
                        <div className={classnames("card-content")}>
                            <div className={classnames("field")}>
                                <label htmlFor={"code"}>{"Game Code"}</label>
                                <div
                                    className={classnames(
                                        "control",
                                        checkingCode && "is-loading",
                                        !checkingCode && "has-icons-right",
                                    )}>
                                    <input
                                        type={"text"}
                                        id={"code"}
                                        name={"code"}
                                        className={"input"}
                                        value={code}
                                        readOnly
                                        disabled
                                    />
                                    {!checkingCode && (
                                        <span
                                            className={classnames(
                                                "icon",
                                                "is-small",
                                                "is-right",
                                            )}>
                                            <FontAwesomeIcon
                                                icon={
                                                    game &&
                                                    !(
                                                        game?.started &&
                                                        game?.ended
                                                    )
                                                        ? faCheck
                                                        : faTimes
                                                }
                                            />
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className={"field"}>
                                <label htmlFor={"name"}>
                                    {"Your nickname"}
                                </label>
                                <div className={"control"}>
                                    <input
                                        type={"text"}
                                        id={"name"}
                                        name={"name"}
                                        className={"input"}
                                        value={values.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {!checkingCode &&
                                (!game || game.started || game.ended) && (
                                    <div
                                        className={classnames(
                                            "notification",
                                            "is-danger",
                                            "mt-2",
                                        )}>
                                        <strong>{"ERROR:"}</strong>
                                        {NBSP}
                                        {
                                            "Invalid code. Please check the URL & retry."
                                        }
                                    </div>
                                )}
                        </div>
                        <footer className={"card-footer"}>
                            <Button
                                type={"submit"}
                                label={"Start"}
                                variant={"link"}
                                disabled={
                                    !(game && !(game.started && game.ended)) ||
                                    !values.name
                                }
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

JoinContainer.propTypes = {
    onJoinGame: PropTypes.func.isRequired,
};

export default JoinContainer;
