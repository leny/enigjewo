/* leny/enigjewo
 *
 * /src/containers/menu.js - Menu Container
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import PropTypes from "prop-types";
import classnames from "classnames";

import Button from "components/commons/button";

const MenuContainer = ({onSelectMode}) => (
    <section className={"section"}>
        <div className={"container"}>
            <div className={classnames("notification")}>
                <h1 className={"title"}>{"Enigjewo"}</h1>
                <h2 className={"subtitle"}>{"A Geoguessr clone"}</h2>

                <p>{"Please, launch the game."}</p>
            </div>
            <div>
                <Button label={"Start a game"} onClick={() => onSelectMode()} />
            </div>
        </div>
    </section>
);

MenuContainer.propTypes = {
    onSelectMode: PropTypes.func.isRequired,
};

export default MenuContainer;
