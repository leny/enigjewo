/* leny/enigjewo
 *
 * /src/components/game/tool-icon.js - Game Tool Icon
 *
 * coded by leny@BeCode
 * started at 02/02/2021
 */

import classnames from "classnames";
import PropTypes from "prop-types";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons";

import {preventDefault, noop} from "core/utils";

const ToolIcon = ({
    size = "medium",
    variant = "dark",
    icon,
    title,
    disabled = false,
    active = false,
    onClick,
}) => (
    <a
        href={disabled ? null : "#"}
        className={classnames("icon", `is-${size}`)}
        title={title}
        onClick={preventDefault(disabled ? noop : onClick)}>
        <span
            className={classnames(
                "fa-stack",
                "fa-sm",
                active && `has-text-link`,
                `has-text-${disabled ? "light" : variant}`,
            )}>
            <FontAwesomeIcon icon={faCircle} className={"fa-stack-2x"} />
            <FontAwesomeIcon
                icon={icon}
                className={classnames(
                    "fa-stack-1x",
                    "fa-stack-adjust",
                    disabled && "has-text-grey",
                )}
                inverse={!disabled}
            />
        </span>
    </a>
);

ToolIcon.propTypes = {
    icon: PropTypes.object.isRequired,
    size: PropTypes.string,
    disabled: PropTypes.bool,
    active: PropTypes.bool,
    title: PropTypes.string,
    onClick: PropTypes.func.isRequired,
};

export default ToolIcon;
