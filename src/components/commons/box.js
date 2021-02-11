/* leny/enigjewo
 *
 * /src/components/commons/box.js - Commons Component: box
 *
 * coded by leny@BeCode
 * started at 11/02/2021
 */

import PropTypes from "prop-types";
import classnames from "classnames";

const Box = ({title, children, footer}) => (
    <div className={"card"}>
        <header className={classnames("card-header", "has-background-info")}>
            <span className={classnames("card-header-title", "has-text-white")}>
                {title}
            </span>
        </header>
        {children}
        <footer className={"card-footer"}>{footer}</footer>
    </div>
);

Box.propTypes = {
    title: PropTypes.node.isRequired,
    children: PropTypes.node,
    footer: PropTypes.node.isRequired,
};

export default Box;
