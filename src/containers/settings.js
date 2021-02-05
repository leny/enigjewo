/* leny/enigjewo
 *
 * /src/containers/settings.js - Settings Container
 *
 * coded by leny@BeCode
 * started at 05/02/2021
 */

import "styles/settings.scss";

import PropTypes from "prop-types";

import {useFormik} from "formik";

import {NBSP} from "core/constants";

import classnames from "classnames";

import Button from "components/commons/button";

const SettingsContainer = ({onStartGame}) => {
    const {handleSubmit, handleChange, values} = useFormik({
        initialValues: {
            totalRounds: 5,
            roundDuration: 300,
        },
        onSubmit: data => {
            onStartGame(data);
        },
    });

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
                                {"Start a Game"}
                            </span>
                        </header>
                        <div className={classnames("card-content")}>
                            <div className={"field"}>
                                <label htmlFor={"totalRounds"}>
                                    {"Number of rounds"}
                                </label>
                                <div className={"control"}>
                                    <input
                                        type={"number"}
                                        id={"totalRounds"}
                                        name={"totalRounds"}
                                        className={"input"}
                                        min={1}
                                        value={values.totalRounds}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className={"field"}>
                                <label htmlFor={"roundDuration"}>
                                    {"Round duration"}
                                    {NBSP}
                                    <small className={"has-text-grey"}>
                                        {"(in minutes)"}
                                    </small>
                                </label>
                                <div
                                    className={classnames(
                                        "control",
                                        "is-flex",
                                        "is-align-content-space-between",
                                        "is-align-items-center",
                                    )}>
                                    <div
                                        className={classnames(
                                            "settings__duration-range",
                                        )}>
                                        <input
                                            type={"range"}
                                            name={"roundDuration"}
                                            id={"roundDuration"}
                                            min={0}
                                            value={values.roundDuration}
                                            step={30}
                                            max={600}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div
                                        className={classnames(
                                            "settings__duration-value",
                                            "px-2",
                                            "has-text-centered",
                                        )}>
                                        <strong>
                                            {values.roundDuration
                                                ? `${String(
                                                      ~~(
                                                          values.roundDuration /
                                                          60
                                                      ),
                                                  ).padStart(2, "0")}:${String(
                                                      values.roundDuration % 60,
                                                  ).padStart(2, "0")}`
                                                : "Infinite"}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <footer className={"card-footer"}>
                            <Button
                                type={"submit"}
                                label={"Start"}
                                variant={"link"}
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

SettingsContainer.propTypes = {
    onStartGame: PropTypes.func.isRequired,
};

export default SettingsContainer;
