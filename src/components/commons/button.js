/* leny/enigjewo
 *
 * /src/components/commons/button.js - Common button
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

/* eslint-disable react/button-has-type */

import PropTypes from "prop-types";
import classnames from "classnames";

const Button = ({
    className,
    label,
    disabled,
    variant = "info",
    type = "button",
    onClick,
}) => (
    <button
        type={type}
        disabled={disabled}
        className={classnames("button", `is-${variant}`, className)}
        onClick={onClick}>
        {label}
    </button>
);

Button.propTypes = {
    type: PropTypes.string,
    label: PropTypes.string.isRequired,
    variant: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};

export default Button;
