/* leny/enigjewo
 *
 * /src/containers/root.js - Container: root
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import {useState, useEffect, useCallback} from "react";
import {useGMapAPILoader} from "hooks/use-gmap-api-loader";
import classnames from "classnames";

import "styles/main.scss";
import bcgImage from "url:../assets/bcg.jpg";

import {MODE_MENU, MODE_GAME, MODE_SETTINGS} from "core/constants";

import MenuContainer from "containers/menu";
import GameContainer from "containers/game";
import SettingsContainer from "containers/settings";

import Loading from "components/commons/loading";

const RootContainer = () => {
    const [loading] = useGMapAPILoader();
    const [gameSettings, setGameSettings] = useState(null);
    const [mode, setMode] = useState(MODE_MENU);

    const handleStartGame = useCallback(
        options => {
            setGameSettings(options);
            setMode(MODE_GAME);
        },
        [setGameSettings, setMode],
    );

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

    if (mode === MODE_SETTINGS) {
        return <SettingsContainer onStartGame={handleStartGame} />;
    }

    if (mode === MODE_GAME) {
        return (
            <GameContainer
                settings={gameSettings}
                onRestart={() => setMode(MODE_SETTINGS)}
            />
        );
    }

    return (
        <MenuContainer
            onPrepareGame={() => setMode(MODE_SETTINGS)}
            onJoinGame={() => console.warn("Join Game!")}
        />
    );
};

export default RootContainer;
