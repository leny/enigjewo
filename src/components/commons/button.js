/* leny/enigjewo
 *
 * /src/components/commons/button.js - Common button
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import React from "react";
import classnames from "classnames";

const Button = ({label, variant = "info", onClick}) => (
    <button
        type={"button"}
        className={classnames("button", `is-${variant}`)}
        onClick={onClick}>
        {label}
    </button>
);

export default Button;
