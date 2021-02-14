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
import bcgImage from "url:assets/bcg.jpg?as=webp&width=1920&quality=50";

import {MODE_MENU, MODE_GAME, MODE_SETTINGS, MODE_JOIN} from "core/constants";

import MenuContainer from "containers/menu";
import GameContainer from "containers/game";
import SettingsContainer from "containers/settings";
import JoinContainer from "containers/join";

import Loading from "components/commons/loading";

const RootContainer = () => {
    const [loading] = useGMapAPILoader();
    const [gameSettings, setGameSettings] = useState(null);
    const [mode, setMode] = useState(MODE_MENU);
    const [code, setCode] = useState(null);

    const handleStartGame = useCallback(
        options => {
            setGameSettings(options);
            setMode(MODE_GAME);
        },
        [setGameSettings, setMode],
    );

    const handleJoinGame = useCallback(options => {
        setGameSettings(options);
        setMode(MODE_GAME);
    }, []);

    const handleContinueGame = useCallback(options => {
        setGameSettings(options);
        setMode(MODE_GAME);
    }, []);

    const handleShowSummary = useCallback(
        game => {
            setGameSettings({ended: true, code, game});
            setMode(MODE_GAME);
        },
        [code],
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

    if (mode === MODE_JOIN) {
        return (
            <JoinContainer
                code={code}
                onJoinGame={handleJoinGame}
                onContinueGame={handleContinueGame}
                onShowSummary={handleShowSummary}
            />
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
            onJoinGame={gameCode => {
                setMode(MODE_JOIN);
                setCode(gameCode);
            }}
        />
    );
};

export default RootContainer;
