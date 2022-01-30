/* leny/enigjewo
 *
 * /src/components/game/setup-challenge.js - Game Component: setup challenge
 *
 * coded by leny
 * started at 30/01/2022
 */

import "styles/game/setup-challenge.scss";

import classnames from "classnames";
import PropTypes from "prop-types";
import {useContext} from "react";
import {useFormik} from "formik";
import {useLocalStorage} from "react-use-storage";

import {GameStoreContext} from "store/game";
import {maps} from "core/maps";
import {generatePlayerKey} from "core/utils";
import {getRandomPlayerColor} from "core/icons";

import Button from "components/commons/button";
import Box from "components/commons/box";
import Input from "components/form/input";

const SetupChallenge = ({onSubmitChallenge}) => {
    const {settings} = useContext(GameStoreContext);
    const [rawPlayerKey, setRawPlayerKey] = useLocalStorage(
        "settings-player-key",
        generatePlayerKey("Player"),
    );
    const [rawPlayerName, setRawPlayerName] = useLocalStorage(
        "settings-player-name",
        "Player",
    );

    const {handleSubmit, handleChange, values} = useFormik({
        initialValues: {
            name: rawPlayerName,
            title: `My awesome ${maps[settings.map].label} challenge`,
        },
        onSubmit: ({title, name}) => {
            const key =
                name !== rawPlayerName ? generatePlayerKey(name) : rawPlayerKey;
            onSubmitChallenge({
                title:
                    title || `My awesome ${maps[settings.map].label} challenge`,
                player: {
                    key,
                    name,
                    icon: getRandomPlayerColor(),
                },
            });
            if (name !== rawPlayerName) {
                setRawPlayerName(name);
                setRawPlayerKey(key);
            }
        },
    });

    const $footer = (
        <Button
            type={"submit"}
            label={"Submit challenge"}
            variant={"link"}
            className={classnames("card-footer-item", "no-top-radius")}
        />
    );

    return (
        <div className={classnames("columns", "is-centered")}>
            <div className={classnames("column", "is-two-thirds", "section")}>
                <form action={"#"} onSubmit={handleSubmit}>
                    <Box title={"Setup Challenge"} footer={$footer}>
                        <div className={classnames("card-content")}>
                            <div className={classnames("mb-3")}>
                                <p>
                                    {
                                        "Choose a Game Title & your nickname to setup your challenge."
                                    }
                                </p>
                                <p>
                                    {
                                        "You will then receive a code to pass to other players, letting them join your challenge and try to beat your score on the same Match."
                                    }
                                </p>
                            </div>

                            <hr />

                            <Input
                                id={"title"}
                                name={"title"}
                                label={"Title of the game"}
                                value={values.title}
                                onChange={handleChange}
                            />
                            <Input
                                id={"name"}
                                name={"name"}
                                label={"Your nickname"}
                                value={values.name}
                                onChange={handleChange}
                            />
                        </div>
                    </Box>
                </form>
            </div>
        </div>
    );
};

SetupChallenge.propTypes = {
    onSubmitChallenge: PropTypes.func,
};

export default SetupChallenge;
