/* leny/enigjewo
 *
 * /src/components/form/selector.js - Form Component: selector
 *
 * coded by leny@BeCode
 * started at 11/02/2021
 */

import PropTypes from "prop-types";
import classnames from "classnames";
import FormBase from "components/form/base";

import Button from "components/commons/button";

const FormSelector = ({id, value, choices, onChange, className}) => (
    <FormBase
        id={id}
        className={classnames(
            "has-addons",
            "is-justify-content-center",
            className,
        )}>
        {choices.map(({name, value: val}) => (
            <div key={name} className={"control"}>
                <Button
                    label={name}
                    variant={"info"}
                    className={classnames(value !== val && "is-outlined")}
                    onClick={() => onChange(val)}
                />
            </div>
        ))}
    </FormBase>
);

FormSelector.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    choices: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            value: PropTypes.any.isRequired,
        }),
    ).isRequired,
    onChange: PropTypes.func.isRequired,
};

export default FormSelector;
