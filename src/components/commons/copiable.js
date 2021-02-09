/* leny/enigjewo
 *
 * /src/components/commons/copiable.js - Common Component: Copiable
 *
 * coded by leny@BeCode
 * started at 09/02/2021
 */

import "styles/lobby.scss";

import PropTypes from "prop-types";

import {useCallback, useEffect, useState} from "react";
import useClippy from "use-clippy";

import {NBSP} from "core/constants";
import classnames from "classnames";
import {preventDefault} from "core/utils";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faClipboardCheck} from "@fortawesome/free-solid-svg-icons";

const Copiable = ({className, children, text}) => {
    const [copied, setCopied] = useState(false);
    const [, setClipboard] = useClippy();

    const handleClick = useCallback(
        preventDefault(() => {
            setClipboard(text);
            setCopied(true);
        }),
        [text, setClipboard, setCopied],
    );

    useEffect(() => {
        let timeoutID;

        copied && (timeoutID = setTimeout(() => setCopied(false), 500));

        return () => copied && timeoutID && clearTimeout(timeoutID);
    }, [copied]);

    return (
        <a
            href={"#"}
            onClick={handleClick}
            className={classnames("has-text-black", className)}
            title={"Click to copy"}>
            {children}
            {NBSP}
            <span
                className={classnames(
                    "icon",
                    "is-small",
                    "is-size-6",
                    `has-text-${copied ? "success" : "grey-light"}`,
                )}>
                <FontAwesomeIcon icon={copied ? faClipboardCheck : faCopy} />
            </span>
        </a>
    );
};

Copiable.propTypes = {
    children: PropTypes.node.isRequired,
    text: PropTypes.string.isRequired,
};

export default Copiable;
