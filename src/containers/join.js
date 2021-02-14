/* leny/enigjewo
 *
 * /src/containers/join.js - Join Container
 *
 * coded by leny@BeCode
 * started at 09/02/2021
 */

import "styles/settings.scss";

import PropTypes from "prop-types";

import {useEffect, useState, useMemo} from "react";
import {useFormik} from "formik";
import {useLocalStorage} from "react-use-storage";

import {NBSP} from "core/constants";
import {getRandomPlayerColor} from "core/icons";
import {generatePlayerKey} from "core/utils";
import {db} from "core/firebase";
import classnames from "classnames";

import Box from "components/commons/box";
import Button from "components/commons/button";
import Input from "components/form/input";

const JoinContainer = ({code, onJoinGame, onContinueGame, onShowSummary}) => {
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

    const canContinue = useMemo(
        () =>
            !checkingCode &&
            (!game || (game.started && !game.ended)) &&
            !!game.players[rawPlayerKey],
        [checkingCode, game, rawPlayerKey],
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

            if (canContinue) {
                onContinueGame({
                    code,
                    continue: true,
                    player: {key: rawPlayerKey},
                });
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
                        key,
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
                (game.started && !game.ended && !canContinue)
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
                                (!game || (game.started && !game.ended)) &&
                                (canContinue ? (
                                    <div
                                        className={classnames(
                                            "notification",
                                            "is-success",
                                            "mt-2",
                                        )}>
                                        <strong>{"NOTE:"}</strong>
                                        {NBSP}
                                        {
                                            "The game has continued without you. You will come back in the match with a random guess for the current round."
                                        }
                                    </div>
                                ) : (
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
                                ))}
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
    onContinueGame: PropTypes.func.isRequired,
    onShowSummary: PropTypes.func.isRequired,
};

export default JoinContainer;
