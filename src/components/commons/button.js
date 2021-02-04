/* leny/enigjewo
 *
 * /src/components/commons/button.js - Common button
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import PropTypes from "prop-types";
import classnames from "classnames";

const Button = ({className, label, disabled, variant = "info", onClick}) => (
    <button
        type={"button"}
        disabled={disabled}
        className={classnames("button", `is-${variant}`, className)}
        onClick={onClick}>
        {label}
    </button>
);

Button.propTypes = {
    label: PropTypes.string.isRequired,
    variant: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};

export default Button;
