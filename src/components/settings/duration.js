/* leny/enigjewo
 *
 * /src/components/settings/duration.js - Settings Component: duration
 *
 * coded by leny
 * started at 11/02/2021
 */

import PropTypes from "prop-types";
import classnames from "classnames";
import {NBSP} from "core/constants";
import {readableDuration} from "core/utils";

import FormBase from "components/form/base";

const SettingsDurationSelector = ({id, name, value, onChange, className}) => {
    const $label = (
        <>
            {"Round duration"}
            {NBSP}
            <small className={"has-text-grey"}>{"(in minutes)"}</small>
        </>
    );

    return (
        <FormBase id={id} label={$label} className={className}>
            <div
                className={classnames(
                    "control",
                    "is-flex",
                    "is-align-content-space-between",
                    "is-align-items-center",
                    "mt-2",
                )}>
                <div className={classnames("settings__duration-range")}>
                    <input
                        type={"range"}
                        name={name}
                        id={id}
                        min={0}
                        value={value}
                        step={30}
                        max={600}
                        onChange={onChange}
                    />
                </div>
                <div
                    className={classnames(
                        "settings__duration-value",
                        "px-2",
                        "has-text-centered",
                    )}>
                    <strong>
                        {value ? readableDuration(value) : "Infinite"}
                    </strong>
                </div>
            </div>
        </FormBase>
    );
};

SettingsDurationSelector.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default SettingsDurationSelector;
