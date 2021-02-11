/* leny/enigjewo
 *
 * /src/components/form/input.js - Form Component: input
 *
 * coded by leny@BeCode
 * started at 11/02/2021
 */

import PropTypes from "prop-types";
import classnames from "classnames";

import {noop} from "core/utils";

import FormBase from "components/form/base";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes, faCheck} from "@fortawesome/free-solid-svg-icons";

const FormInput = ({
    id,
    name,
    label,
    value,
    onChange = noop,
    type = "text",
    readOnly,
    disabled,
    loading,
    isValid = null,
    className,
    ...props
}) => (
    <FormBase id={id} label={label} className={className}>
        <div
            className={classnames(
                "control",
                loading && "is-loading",
                isValid != null && "has-icons-right",
            )}>
            <input
                type={type}
                id={id}
                name={name}
                className={"input"}
                value={value}
                readOnly={readOnly}
                disabled={disabled}
                onChange={onChange}
                {...props}
            />
            {isValid != null && (
                <span className={classnames("icon", "is-small", "is-right")}>
                    <FontAwesomeIcon icon={isValid ? faCheck : faTimes} />
                </span>
            )}
        </div>
    </FormBase>
);

FormInput.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    type: PropTypes.string,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func,
};

export default FormInput;
