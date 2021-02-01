/* leny/enigjewo
 *
 * /src/components/commons/hello.js - Dumb first component
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import React from "react";
import classnames from "classnames";

const Hello = ({name, primary = false}) => (
    <div className={classnames("notification", primary && "is-primary")}>
        {`Hello, ${name}!`}
    </div>
);

export default Hello;
