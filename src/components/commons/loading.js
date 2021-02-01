/* leny/enigjewo
 *
 * /src/components/commons/loading.js - Loading icon
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import classnames from "classnames";
import PropTypes from "prop-types";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";

const Loading = ({variant, size}) => (
    <span
        className={classnames(
            "icon",
            variant && `has-text-${variant}`,
            size && `is-${size}`,
        )}>
        <FontAwesomeIcon
            icon={faCircleNotch}
            spin
            size={size === "large" ? "2x" : null}
        />
    </span>
);

Loading.propTypes = {
    variant: PropTypes.string,
    size: PropTypes.string,
};

export default Loading;
