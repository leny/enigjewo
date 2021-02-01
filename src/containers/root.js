/* leny/enigjewo
 *
 * /src/containers/root.js - Container: root
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import {useState} from "react";
import {useGMapAPILoader} from "hooks/use-gmap-api-loader";
import classnames from "classnames";

import {MODE_MENU, MODE_GAME} from "core/constants";

import MenuContainer from "containers/menu";

import Loading from "components/commons/loading";

const RootContainer = () => {
    const [loading] = useGMapAPILoader();
    const [mode, setMode] = useState(MODE_MENU);

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
        console.log("Show game window!");
    }

    return <MenuContainer onSelectGameMode={() => setMode(MODE_GAME)} />;
};

export default RootContainer;
