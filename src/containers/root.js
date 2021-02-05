/* leny/enigjewo
 *
 * /src/containers/root.js - Container: root
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import {useState, useEffect} from "react";
import {useGMapAPILoader} from "hooks/use-gmap-api-loader";
import classnames from "classnames";

import "styles/main.scss";
import bcgImage from "assets/bcg.jpg";

import {MODE_MENU, MODE_GAME} from "core/constants";

import MenuContainer from "containers/menu";
import GameContainer from "containers/game";

import Loading from "components/commons/loading";

const RootContainer = () => {
    const [loading] = useGMapAPILoader();
    const [mode, setMode] = useState(MODE_MENU);

    useEffect(() => {
        document.querySelector(
            "html",
        ).style.backgroundImage = `url(${bcgImage})`;
    }, []);

    if (loading) {
        return (
            <section className={"section"}>
                <div className={classnames("container", "has-text-centered")}>
                    <Loading variant={"info"} size={"large"} />
                </div>
            </section>
        );
    }

    if (mode === MODE_GAME) {
        return <GameContainer />;
    }

    return <MenuContainer onSelectGameMode={() => setMode(MODE_GAME)} />;
};

export default RootContainer;
