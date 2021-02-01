/* leny/enigjewo
 *
 * /src/containers/root.js - Container: root
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import {useState} from "react";

import {MODE_MENU, MODE_GAME} from "core/constants";

import MenuContainer from "containers/menu";

const RootContainer = () => {
    const [mode, setMode] = useState(MODE_MENU);

    if (mode === MODE_GAME) {
        console.log("Show game window!");
    }

    return <MenuContainer onSelectGameMode={() => setMode(MODE_GAME)} />;
};

export default RootContainer;
