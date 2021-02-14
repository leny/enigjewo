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
import {useLocalStorage} from "react-use-storage";

import {NBSP} from "core/constants";
import {getRandomPlayerColor} from "core/icons";
import {hashid, generatePlayerKey} from "core/utils";
import {db} from "core/firebase";
import classnames from "classnames";

import Box from "components/commons/box";
import Button from "components/commons/button";
import Input from "components/form/input";

const JoinContainer = ({code, onJoinGame, onShowSummary}) => {
    const [checkingCode, setCheckingCode] = useState(true);
    const [game, setGame] = useState(null);
    const [rawPlayerKey, setRawPlayerKey] = useLocalStorage(
        "settings-player-key",
        generatePlayerKey("Player"),
    );
    const [rawPlayerName, setRawPlayerName] = useLocalStorage(
        "settings-player-name",
        "",
    );
    const {handleSubmit, handleChange, values} = useFormik({
        initialValues: {
            name: rawPlayerName,
        },
        onSubmit: ({name}) => {
            if (game.ended) {
                onShowSummary(game);
                return;
            }

            if (name) {
                const key =
                    name !== rawPlayerName
                        ? generatePlayerKey(name)
                        : rawPlayerKey;
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
                if (name !== rawPlayerName) {
                    setRawPlayerName(name);
                    setRawPlayerKey(key);
                }
            }
        },
    });

    useEffect(() => {
        (async () => {
            setGame((await db.ref(`games/${code}`).get()).val());
            setCheckingCode(false);
        })();
    }, [code]);

    const $footer = (
        <Button
            type={"submit"}
            label={game?.ended ? "Show summary" : "Start"}
            variant={"link"}
            disabled={
                !game ||
                (!game.started && !values.name) ||
                (game.started && !game.ended)
            }
            className={classnames("card-footer-item", "no-top-radius")}
        />
    );

    return (
        <div className={classnames("columns", "is-centered")}>
            <div className={classnames("column", "is-two-thirds", "section")}>
                <form action={"#"} onSubmit={handleSubmit}>
                    <Box title={"Join a Game"} footer={$footer}>
                        <div className={classnames("card-content")}>
                            <Input
                                id={"code"}
                                name={"code"}
                                label={"Game Code"}
                                value={code}
                                readOnly
                                disabled
                                loading={checkingCode}
                                isValid={
                                    !checkingCode &&
                                    game &&
                                    !(game?.started && game?.ended)
                                }
                            />
                            {!checkingCode && game && !game.started && (
                                <Input
                                    id={"name"}
                                    name={"name"}
                                    label={"Your nickname"}
                                    value={values.name}
                                    onChange={handleChange}
                                />
                            )}
                            {!checkingCode &&
                                (!game || (game.started && !game.ended)) && (
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
                            {!checkingCode && game && game.ended && (
                                <div
                                    className={classnames(
                                        "notification",
                                        "is-warning",
                                        "mt-2",
                                    )}>
                                    {
                                        "This game is already finish. You can consult the results."
                                    }
                                </div>
                            )}
                        </div>
                    </Box>
                </form>
            </div>
        </div>
    );
};

JoinContainer.propTypes = {
    onJoinGame: PropTypes.func.isRequired,
    onShowSummary: PropTypes.func.isRequired,
};

export default JoinContainer;
